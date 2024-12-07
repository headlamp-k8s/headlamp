# Type Alias: StreamUpdatesCb()\<T\>

```ts
type StreamUpdatesCb<T>: (data: T | StreamUpdate<T>) => void;
```

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `any` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `T` \| [`StreamUpdate`](StreamUpdate.md)\<`T`\> |

## Returns

`void`

## Defined in

[frontend/src/lib/k8s/api/v1/streamingApi.ts:17](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/streamingApi.ts#L17)
