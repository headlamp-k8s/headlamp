# Function: registerSetTokenFunction()

```ts
function registerSetTokenFunction(override: (cluster: string, token: null | string) => void): void
```

Override headlamp setToken method

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `override` | (`cluster`: `string`, `token`: `null` \| `string`) => `void` | The setToken override method to use. |

## Returns

`void`

## Example

```ts
registerSetTokenFunction((cluster: string, token: string | null) => {
// set token logic here
});
```

## Defined in

[frontend/src/plugin/registry.tsx:589](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/plugin/registry.tsx#L589)
