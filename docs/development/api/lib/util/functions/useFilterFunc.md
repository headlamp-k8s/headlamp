# Function: useFilterFunc()

```ts
function useFilterFunc<T>(matchCriteria?: string[]): (item: T, search?: string) => boolean
```

Get a function to filter kube resources based on the current global filter state.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`KubeObjectInterface`](../../k8s/KubeObject/interfaces/KubeObjectInterface.md) \| [`KubeEvent`](../../k8s/event/interfaces/KubeEvent.md) \| \{\} | [`KubeObjectInterface`](../../k8s/KubeObject/interfaces/KubeObjectInterface.md) \| [`KubeEvent`](../../k8s/event/interfaces/KubeEvent.md) |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `matchCriteria`? | `string`[] | The JSONPath criteria to match. |

## Returns

`Function`

A filter function that can be used to filter a list of items.

### Parameters

| Parameter | Type |
| ------ | ------ |
| `item` | `T` |
| `search`? | `string` |

### Returns

`boolean`

## Defined in

[frontend/src/lib/util.ts:157](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/util.ts#L157)
