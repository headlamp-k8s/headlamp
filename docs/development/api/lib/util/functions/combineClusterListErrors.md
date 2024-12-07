# Function: combineClusterListErrors()

```ts
function combineClusterListErrors(...args: (null | {})[]): {} | null
```

Combines errors per cluster.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`args` | (`null` \| \{\})[] | The list of errors per cluster to join. |

## Returns

\{\} \| `null`

The joint list of errors, or null if there are no errors.

## Defined in

[frontend/src/lib/util.ts:221](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/util.ts#L221)
