# Function: runCommand()

```ts
function runCommand(
   command: "minikube" | "az", 
   args: string[], 
   options: object): object
```

Runs a shell command and returns an object that mimics the interface of a ChildProcess object returned by Node's spawn function.

This function is intended to be used only when Headlamp is in app mode.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `command` | `"minikube"` \| `"az"` | The command to run. |
| `args` | `string`[] | An array of arguments to pass to the command. |
| `options` | \{\} | - |

## Returns

`object`

An object with `stdout`, `stderr`, and `on` properties. You can listen for 'data' events on `stdout` and `stderr`, and 'exit' events with `on`.

### on()

```ts
on: (event: string, listener: (code: number | null) => void) => void;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `string` |
| `listener` | (`code`: `number` \| `null`) => `void` |

#### Returns

`void`

### stderr

```ts
stderr: object;
```

#### stderr.on()

```ts
on: (event: string, listener: (chunk: any) => void) => void;
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `string` |
| `listener` | (`chunk`: `any`) => `void` |

##### Returns

`void`

### stdout

```ts
stdout: object;
```

#### stdout.on()

```ts
on: (event: string, listener: (chunk: any) => void) => void;
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `string` |
| `listener` | (`chunk`: `any`) => `void` |

##### Returns

`void`

## See

handleRunCommand in app/electron/main.ts

This function uses the desktopApi.send and desktopApi.receive methods to communicate with the main process.

## Example

```ts
  const minikube = runCommand('minikube', ['status']);
  minikube.stdout.on('data', (data) => {
    console.log('stdout:', data);
  });
  minikube.stderr.on('data', (data) => {
    console.log('stderr:', data);
  });
  minikube.on('exit', (code) => {
    console.log('exit code:', code);
  });
```

## Defined in

[frontend/src/components/App/runCommand.ts:27](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/components/App/runCommand.ts#L27)
