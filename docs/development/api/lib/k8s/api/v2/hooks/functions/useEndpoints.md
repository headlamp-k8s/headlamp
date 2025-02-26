# Function: useEndpoints()

```ts
function useEndpoints(
   endpoints: KubeObjectEndpoint[], 
   cluster?: string, 
   namespace?: string): undefined | null | KubeObjectEndpoint
```

Checks and returns an endpoint that works from the list

## Parameters

| Parameter | Type |
| ------ | ------ |
| `endpoints` | [`KubeObjectEndpoint`](../../KubeObjectEndpoint/interfaces/KubeObjectEndpoint.md)[] |
| `cluster`? | `string` |
| `namespace`? | `string` |

## Returns

`undefined` \| `null` \| [`KubeObjectEndpoint`](../../KubeObjectEndpoint/interfaces/KubeObjectEndpoint.md)

## Params

endpoints - List of possible endpoints

## Defined in

[frontend/src/lib/k8s/api/v2/hooks.ts:186](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/hooks.ts#L186)
