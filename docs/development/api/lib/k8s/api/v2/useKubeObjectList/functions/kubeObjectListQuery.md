# Function: kubeObjectListQuery()

```ts
function kubeObjectListQuery<K>(
   kubeObjectClass: typeof KubeObject, 
   endpoint: KubeObjectEndpoint, 
   namespace: undefined | string, 
   cluster: string, 
queryParams: QueryParameters): QueryObserverOptions<ListResponse<K> | undefined | null, ListError>
```

Query to list Kube objects from a cluster and namespace(optional)

## Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* [`KubeObject`](../../../../KubeObject/classes/KubeObject.md)\<`any`\> |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `kubeObjectClass` | *typeof* [`KubeObject`](../../../../KubeObject/classes/KubeObject.md) | Class to instantiate the object with |
| `endpoint` | [`KubeObjectEndpoint`](../../KubeObjectEndpoint/interfaces/KubeObjectEndpoint.md) | API endpoint |
| `namespace` | `undefined` \| `string` | namespace to list objects from(optional) |
| `cluster` | `string` | cluster name |
| `queryParams` | [`QueryParameters`](../../../v1/queryParameters/interfaces/QueryParameters.md) | query parameters |

## Returns

`QueryObserverOptions`\<[`ListResponse`](../interfaces/ListResponse.md)\<`K`\> \| `undefined` \| `null`, `ListError`\>

query options for getting a single list of kube resources

## Defined in

[frontend/src/lib/k8s/api/v2/useKubeObjectList.ts:46](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/useKubeObjectList.ts#L46)
