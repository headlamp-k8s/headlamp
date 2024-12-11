# Function: registerGetTokenFunction()

```ts
function registerGetTokenFunction(override: (cluster: string) => undefined | string): void
```

Override headlamp getToken method

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `override` | (`cluster`: `string`) => `undefined` \| `string` | The getToken override method to use. |

## Returns

`void`

## Example

```ts
registerGetTokenFunction(() => {
// set token logic here
});
```

## Defined in

[frontend/src/plugin/registry.tsx:607](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/plugin/registry.tsx#L607)
