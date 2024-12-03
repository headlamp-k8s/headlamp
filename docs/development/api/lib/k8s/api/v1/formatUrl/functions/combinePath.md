# Function: combinePath()

```ts
function combinePath(base: string, path: string): string
```

Combines a base path and a path to create a full path.

Doesn't matter if the start or the end has a single slash, the result will always have a single slash.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `base` | `string` | The base path. |
| `path` | `string` | The path to combine with the base path. |

## Returns

`string`

The combined path.

## Defined in

[frontend/src/lib/k8s/api/v1/formatUrl.ts:19](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/formatUrl.ts#L19)
