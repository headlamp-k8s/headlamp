# Interface: ScaleApi

## Properties

### get()

```ts
get: (namespace: string, name: string, clusterName?: string) => Promise<any>;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |
| `name` | `string` |
| `clusterName`? | `string` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[frontend/src/lib/k8s/api/v1/scaleApi.ts:6](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/scaleApi.ts#L6)

***

### patch()

```ts
patch: (body: object, metadata: KubeMetadata, clusterName?: string) => Promise<any>;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `body` | \{ `spec`: \{ `replicas`: `number`; \}; \} |
| `body.spec` | \{ `replicas`: `number`; \} |
| `body.spec.replicas` | `number` |
| `metadata`? | [`KubeMetadata`](../../../../KubeMetadata/interfaces/KubeMetadata.md) |
| `clusterName`? | `string` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[frontend/src/lib/k8s/api/v1/scaleApi.ts:16](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/scaleApi.ts#L16)

***

### put()

```ts
put: (body: object, clusterName?: string) => Promise<any>;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `body` | \{ `metadata`: [`KubeMetadata`](../../../../KubeMetadata/interfaces/KubeMetadata.md); `spec`: \{ `replicas`: `number`; \}; \} |
| `body.metadata` | [`KubeMetadata`](../../../../KubeMetadata/interfaces/KubeMetadata.md) |
| `body.spec`? | \{ `replicas`: `number`; \} |
| `body.spec.replicas`? | `number` |
| `clusterName`? | `string` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[frontend/src/lib/k8s/api/v1/scaleApi.ts:7](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/scaleApi.ts#L7)
