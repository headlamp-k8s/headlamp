import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { execSync } from 'child_process';
import { app, BrowserWindow, dialog } from 'electron';
import { IpcMainEvent } from 'electron/main';
import fs from 'node:fs';
import path from 'path';
import { BINARY_MANIFESTS, binaryManager } from './binaries';
import i18n from './i18next.config';

/**
 * Data sent from the renderer process when a 'run-command' event is emitted.
 */
interface CommandData {
  /** The unique ID of the command. */
  id: string;
  /** The command to run. */
  command: string;
  /** The arguments to pass to the command. */
  args: string[];
  /**
   * Options to pass to the command.
   * See https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
   */
  options: {};
}

/**
 * Data sent from the renderer process when a 'check-commands' event is emitted.
 */
interface CheckCommandsData {
  /** The unique ID of the request. */
  id: string;
  /** The commands to check if they exist. */
  commands: string[];
}

/**
 * Ask the user with an electron dialog if they want to allow the command
 * to be executed.
 * @param command - The command to show in the dialog.
 * @param mainWindow - The main window to show the dialog on.
 *
 * @returns true if the user allows the command to be executed, false otherwise.
 */
function confirmCommandDialog(command: string, mainWindow: BrowserWindow): boolean {
  if (mainWindow === null) {
    return false;
  }
  const resp = dialog.showMessageBoxSync(mainWindow, {
    title: i18n.t('Consent to command being run'),
    message: i18n.t('Allow this local command to be executed? Your choice will be saved.'),
    detail: command,
    type: 'question',
    buttons: [i18n.t('Allow'), i18n.t('Deny')],
  });

  return resp === 0;
}

export const SETTINGS_PATH = path.join(app.getPath('userData'), 'settings.json');

/**
 * Loads the user settings.
 * If the settings file does not exist, an empty object is returned.
 * @returns The settings object.
 */
export function loadSettings() {
  try {
    const data = fs.readFileSync(SETTINGS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

/**
 * Saves the user settings.
 * @param settings - The settings object to save.
 */
export function saveSettings(settings) {
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings), 'utf-8');
}

/**
 * Checks if the user has already consented to running the command.
 *
 * If the user has not consented, a dialog is shown to ask for consent.
 *
 * @param command - The command to check.
 * @param mainWindow - The main window to show the dialog on.
 * @returns true if the user has consented to running the command, false otherwise.
 */
export function checkCommandConsent(
  command: string,
  mainWindow: BrowserWindow,
  forceCheck: boolean = false
): boolean {
  const settings = loadSettings();
  const confirmedCommands = settings?.confirmedCommands;
  const savedCommand: boolean | undefined = confirmedCommands
    ? confirmedCommands[command]
    : undefined;

  if (!forceCheck && savedCommand === false) {
    console.error(`Invalid command: ${command}, command not allowed by users choice`);
    return false;
  }

  if (!!savedCommand) {
    return true;
  }

  const commandChoice = confirmCommandDialog(command, mainWindow);
  if (settings?.confirmedCommands === undefined) {
    settings.confirmedCommands = {};
  }
  settings.confirmedCommands[command] = commandChoice;
  saveSettings(settings);
  return commandChoice;
}

/**
 * Sets the consent status for a command without showing a dialog
 *
 * @param command - The command to set consent for
 * @param consent - Whether to consent to the command or not
 * @returns true if the operation was successful
 */
export function setCommandConsent(command: string, consent: boolean): boolean {
  try {
    const settings = loadSettings();
    if (!settings.confirmedCommands) {
      settings.confirmedCommands = {};
    }

    settings.confirmedCommands[command] = consent;
    saveSettings(settings);
    return true;
  } catch (error) {
    console.error(`Failed to set command consent: ${error}`);
    return false;
  }
}

/**
 * Gets the consent status for a command
 *
 * @param command - The command to get consent status for
 * @returns true if consented, false if denied, undefined if not set
 */
export function getCommandConsent(command: string): boolean | undefined {
  const settings = loadSettings();
  const confirmedCommands = settings?.confirmedCommands;
  return confirmedCommands ? confirmedCommands[command] : undefined;
}

/**
 * Checks if the given command is available in the system or in the Headlamp binary directory.
 *
 * @param command - The command to check.
 * @returns true if the command exists and is executable, false otherwise.
 */
function commandExists(command: string): boolean {
  try {
    // First check if the command is one of our managed binaries and is installed
    if (
      Object.keys(BINARY_MANIFESTS).includes(command) &&
      binaryManager.isBinaryInstalled(command)
    ) {
      return true;
    }

    // Otherwise check if it's available in the system PATH
    const isWin = process.platform === 'win32';
    if (isWin) {
      // On Windows, use 'where' command
      execSync(`where ${command}`, { stdio: 'ignore' });
    } else {
      // On Unix-like systems, use 'which' command
      execSync(`which ${command}`, { stdio: 'ignore' });
    }
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Handles 'check-commands' events from the renderer process.
 *
 * Checks if the requested commands exist and are executable.
 *
 * @param event - The event object.
 * @param eventData - The data sent from the renderer process.
 */
export function handleCheckCommands(event: IpcMainEvent, eventData: CheckCommandsData): void {
  const { id, commands } = eventData;
  // Include all commands from BINARY_MANIFESTS plus minikube and az
  const validCommands = [...Object.keys(BINARY_MANIFESTS), 'minikube', 'az', 'kubectl', 'helm'];
  const results: Record<string, boolean> = {};

  // Only check commands that are in the valid commands list
  commands.forEach(command => {
    if (validCommands.includes(command)) {
      // Check if the command exists and the user has consented to it
      const settings = loadSettings();
      const confirmedCommands = settings?.confirmedCommands || {};

      // Only report as available if the user has consented (value is true)
      // and the command actually exists on the system
      results[command] = confirmedCommands[command] === true && commandExists(command);
    } else {
      // For invalid commands, always return false
      results[command] = false;
    }
  });

  // Send the results back to the renderer
  event.sender.send('check-commands-result', id, results);
}

/**
 * Handles 'run-command' events from the renderer process.
 *
 * Spawns the requested command and sends 'command-stdout',
 * 'command-stderr', and 'command-exit' events back to the renderer
 * process with the command's output and exit code.
 *
 * @param event - The event object.
 * @param eventData - The data sent from the renderer process.
 */
export function handleRunCommand(
  event: IpcMainEvent,
  eventData: CommandData,
  mainWindow: BrowserWindow | null
): void {
  if (mainWindow === null) {
    console.error('Main window is null, cannot show dialog');
    return;
  }

  // Allow commands from our binary manifests plus minikube and az
  const validCommands = [...Object.keys(BINARY_MANIFESTS), 'minikube', 'az'];

  if (!validCommands.includes(eventData.command)) {
    console.error(
      `Invalid command: ${eventData.command}, only valid commands are: ${JSON.stringify(
        validCommands
      )}`
    );
    return;
  }
  if (!checkCommandConsent(eventData.command, mainWindow!)) {
    return;
  }

  // Check if it's a managed binary that needs installation
  const isManagedBinary = Object.keys(BINARY_MANIFESTS).includes(eventData.command);
  if (isManagedBinary && !binaryManager.isBinaryInstalled(eventData.command)) {
    // Ask user if they want to install the binary
    const resp = dialog.showMessageBoxSync(mainWindow, {
      title: i18n.t('Install required binary'),
      message: i18n.t(
        'The command "{{ command }}" is not installed. Would you like to install it now?',
        {
          command: eventData.command,
        }
      ),
      type: 'question',
      buttons: [i18n.t('Install'), i18n.t('Cancel')],
    });

    if (resp === 0) {
      // Show installation progress
      const progressDialog = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        width: 400,
        height: 150,
        autoHideMenuBar: true,
        minimizable: false,
        maximizable: false,
        resizable: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        },
      });

      // Create a simple HTML for the progress dialog
      progressDialog.loadURL(
        `data:text/html,
        <html>
          <head>
            <style>
              body { font-family: sans-serif; padding: 20px; }
              progress { width: 100%; margin-top: 15px; }
            </style>
          </head>
          <body>
            <h3>Installing ${eventData.command}...</h3>
            <progress></progress>
            <p id="status">Downloading...</p>
          </body>
        </html>`
      );

      // Install the binary
      binaryManager
        .installBinaryByName(eventData.command)
        .then(success => {
          progressDialog.close();
          if (success) {
            // Now run the command
            executeCommand(event, eventData);
          } else {
            dialog.showErrorBox(
              i18n.t('Installation Failed'),
              i18n.t('Failed to install {{ command }}. Please try again later.', {
                command: eventData.command,
              })
            );
          }
        })
        .catch(error => {
          progressDialog.close();
          dialog.showErrorBox(
            i18n.t('Installation Error'),
            i18n.t('Error installing {{ command }}: {{ error }}', {
              command: eventData.command,
              error: error.message,
            })
          );
        });
    }
  } else {
    // Binary is already installed or it's a system command, run it directly
    executeCommand(event, eventData);
  }
}

/**
 * Execute a command with the given event data
 */
function executeCommand(event: IpcMainEvent, eventData: CommandData): void {
  // Check if it's one of our managed binaries
  let commandPath = eventData.command;
  if (Object.keys(BINARY_MANIFESTS).includes(eventData.command)) {
    if (binaryManager.isBinaryInstalledByHeadlamp(eventData.command)) {
      commandPath = binaryManager.getBinaryPath(eventData.command);
    } else if (binaryManager.isBinaryInSystemPath(eventData.command)) {
      commandPath = binaryManager.getSystemBinaryPath(eventData.command) ?? eventData.command;
    }
  }
  const child: ChildProcessWithoutNullStreams = spawn(commandPath, eventData.args, {
    ...eventData.options,
    shell: false,
  });

  child.stdout.on('data', (data: string | Buffer) => {
    event.sender.send('command-stdout', eventData.id, data.toString());
  });

  child.stderr.on('data', (data: string | Buffer) => {
    event.sender.send('command-stderr', eventData.id, data.toString());
  });

  child.on('exit', (code: number | null) => {
    event.sender.send('command-exit', eventData.id, code);
  });
}
