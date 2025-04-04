/**
 * Runs a shell command and returns an object that mimics the interface of a ChildProcess object returned by Node's spawn function.
 *
 * This function is intended to be used only when Headlamp is in app mode.
 *
 * @see handleRunCommand in app/electron/main.ts
 *
 * This function uses the desktopApi.send and desktopApi.receive methods to communicate with the main process.
 * @param command - The command to run.
 * @param args - An array of arguments to pass to the command.
 * @returns An object with `stdout`, `stderr`, and `on` properties. You can listen for 'data' events on `stdout` and `stderr`, and 'exit' events with `on`.
 * @example
 *
 * ```ts
 *   const minikube = runCommand('minikube', ['status']);
 *   minikube.stdout.on('data', (data) => {
 *     console.log('stdout:', data);
 *   });
 *   minikube.stderr.on('data', (data) => {
 *     console.log('stderr:', data);
 *   });
 *   minikube.on('exit', (code) => {
 *     console.log('exit code:', code);
 *   });
 * ```
 */
export function runCommand(
  command: 'minikube' | 'az',
  args: string[],
  options: {
    elevated?: boolean;
    [key: string]: any;
  }
): {
  stdout: { on: (event: string, listener: (chunk: any) => void) => void };
  stderr: { on: (event: string, listener: (chunk: any) => void) => void };
  on: (event: string, listener: (code: number | null) => void) => void;
} {
  if (!window.desktopApi) {
    throw new Error('runCommand only works in Headlamp app mode.');
  }

  // Generate a unique ID for the command, so that we can distinguish between
  // multiple commands running at the same time.
  const id = `${new Date().getTime()}-${Math.random().toString(36)}`;

  const stdout = new EventTarget();
  const stderr = new EventTarget();
  const exit = new EventTarget();

  const {elevated, ...restOptions} = options;
  window.desktopApi.send('run-command', { id, command, args, options: restOptions, elevated });

  window.desktopApi.receive('command-stdout', (cmdId: string, data: string) => {
    if (cmdId === id) {
      const event = new CustomEvent('data', { detail: data });
      stdout.dispatchEvent(event);
    }
  });

  window.desktopApi.receive('command-stderr', (cmdId: string, data: string) => {
    if (cmdId === id) {
      const event = new CustomEvent('data', { detail: data });
      stderr.dispatchEvent(event);
    }
  });

  window.desktopApi.receive('command-exit', (cmdId: string, code: number) => {
    if (cmdId === id) {
      const event = new CustomEvent('exit', { detail: code });
      exit.dispatchEvent(event);
    }
  });

  return {
    stdout: {
      on: (event: string, listener: (chunk: any) => void) =>
        stdout.addEventListener(event, (e: any) => listener(e.detail)),
    },
    stderr: {
      on: (event: string, listener: (chunk: any) => void) =>
        stderr.addEventListener(event, (e: any) => listener(e.detail)),
    },
    on: (event: string, listener: (code: number | null) => void) =>
      exit.addEventListener(event, (e: any) => listener(e.detail)),
  };
}
