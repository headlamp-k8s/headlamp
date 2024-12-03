# Function: useErrorState()

```ts
function useErrorState(dependentSetter?: (...args: any) => void): readonly [null | ApiError, Dispatch<SetStateAction<null | ApiError>>]
```

## Parameters

| Parameter | Type |
| ------ | ------ |
| `dependentSetter`? | (...`args`: `any`) => `void` |

## Returns

readonly [`null` \| [`ApiError`](../../k8s/api/v1/clusterRequests/interfaces/ApiError.md), `Dispatch`\<`SetStateAction`\<`null` \| [`ApiError`](../../k8s/api/v1/clusterRequests/interfaces/ApiError.md)\>\>]

## Defined in

[frontend/src/lib/util.ts:183](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/util.ts#L183)
