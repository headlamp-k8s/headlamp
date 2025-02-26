# Variable: KubeObjectEndpoint

```ts
KubeObjectEndpoint: object;
```

## Type declaration

### toUrl()

```ts
toUrl: (endpoint: KubeObjectEndpoint, namespace?: string) => string;
```

Formats endpoints information into a URL path

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `endpoint` | [`KubeObjectEndpoint`](../interfaces/KubeObjectEndpoint.md) | Kubernetes resource endpoint definition |
| `namespace`? | `string` | Namespace, optional |

#### Returns

`string`

Formatted URL path

## Defined in

[frontend/src/lib/k8s/api/v2/KubeObjectEndpoint.ts:1](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/KubeObjectEndpoint.ts#L1)
