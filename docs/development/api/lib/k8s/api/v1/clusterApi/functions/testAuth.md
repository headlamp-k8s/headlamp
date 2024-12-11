# Function: testAuth()

```ts
function testAuth(cluster: string, namespace: string): Promise<any>
```

Test authentication for the given cluster.
Will throw an error if the user is not authenticated.

## Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `cluster` | `string` | `''` |
| `namespace` | `string` | `'default'` |

## Returns

`Promise`\<`any`\>

## Defined in

[frontend/src/lib/k8s/api/v1/clusterApi.ts:17](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/clusterApi.ts#L17)
