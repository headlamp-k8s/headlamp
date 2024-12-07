# Function: testClusterHealth()

```ts
function testClusterHealth(cluster?: string): Promise<any[]>
```

Checks cluster health
Will throw an error if the cluster is not healthy.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `cluster`? | `string` |

## Returns

`Promise`\<`any`[]\>

## Defined in

[frontend/src/lib/k8s/api/v1/clusterApi.ts:31](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/clusterApi.ts#L31)
