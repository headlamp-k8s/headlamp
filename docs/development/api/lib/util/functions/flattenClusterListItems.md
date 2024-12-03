# Function: flattenClusterListItems()

```ts
function flattenClusterListItems<T>(...args: (null | {})[]): T[] | null
```

This function joins a list of items per cluster into a single list of items.

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`args` | (`null` \| \{\})[] | The list of objects per cluster to join. |

## Returns

`T`[] \| `null`

The joined list of items, or null if there are no items.

## Defined in

[frontend/src/lib/util.ts:205](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/util.ts#L205)
