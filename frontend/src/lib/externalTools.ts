import helpers from '../helpers';

export interface ExternalTool {
  name: string;
  displayName: string;
  version: string;
  installed: boolean;
  headlampInstalled: boolean;
  enabled: boolean;
  consented?: boolean;
  description?: string;
  systemInstalled?: boolean;
  systemPath?: string;
  systemVersion?: string;
}

/**
 * Get all available external tools with their status
 * @returns Promise that resolves to the list of external tools
 */
export function getExternalTools(): Promise<ExternalTool[]> {
  if (!helpers.isElectron()) {
    return Promise.resolve([]);
  }

  return window.desktopApi!.invoke('get-available-binaries');
}

/**
 * Install an external tool by name
 * @param name The name of the tool to install
 * @returns Promise that resolves when the installation is complete
 */
export function installExternalTool(name: string): Promise<{ success: boolean; error?: string }> {
  if (!helpers.isElectron()) {
    return Promise.resolve({ success: false, error: 'Not in Electron environment' });
  }

  return window.desktopApi!.invoke('install-binary', name);
}

/**
 * Install multiple external tools at once
 * @param names Array of tool names to install
 * @returns Promise that resolves when the installation is complete
 */
export function installExternalTools(names: string[]): Promise<{
  success: boolean;
  results?: Record<string, { success: boolean; error?: string }>;
  error?: string;
}> {
  if (!helpers.isElectron()) {
    return Promise.resolve({ success: false, error: 'Not in Electron environment' });
  }

  return window.desktopApi!.invoke('install-binaries', names);
}

/**
 * Uninstall an external tool by name
 * @param name The name of the tool to uninstall
 * @returns Promise that resolves to a result object
 */
export function uninstallExternalTool(name: string): Promise<{ success: boolean; error?: string }> {
  if (!helpers.isElectron()) {
    return Promise.resolve({ success: false, error: 'Not in Electron environment' });
  }

  return window.desktopApi!.invoke('uninstall-binary', name);
}

/**
 * Check if an external tool is installed
 * @param name The name of the tool to check
 * @returns Promise that resolves to the path of the tool if installed, null otherwise
 */
export function getExternalToolPath(name: string): Promise<string | null> {
  if (!helpers.isElectron()) {
    return Promise.resolve(null);
  }

  return window.desktopApi!.invoke('get-binary-path', name);
}

/**
 * Enable or disable an external tool
 * @param name The name of the tool
 * @param enabled Whether the tool should be enabled
 * @returns Promise that resolves to true if the operation was successful
 */
export function changeExternalToolConsent(name: string, enabled: boolean): Promise<boolean> {
  if (!helpers.isElectron()) {
    return Promise.resolve(false);
  }

  return window.desktopApi!.invoke('toggle-binary-consent', name, enabled);
}

/**
 * Open the directory where the external tools are installed
 * @returns Promise that resolves when the directory is opened
 */
export function openToolsDirectory(): Promise<void> {
  if (!helpers.isElectron()) {
    return Promise.resolve();
  }

  return window.desktopApi!.invoke('open-tools-directory');
}
