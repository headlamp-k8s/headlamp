---
title: "Class: Ingress"
linkTitle: "Ingress"
slug: "lib_k8s_ingress.Ingress"
---

[lib/k8s/ingress](../modules/lib_k8s_ingress.md).Ingress

## Hierarchy

- `any`

  ↳ **`Ingress`**

## Constructors

### constructor

• **new Ingress**(`json`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | [`KubeIngress`](../interfaces/lib_k8s_ingress.KubeIngress.md) |

#### Inherited from

makeKubeObject<KubeIngress\>('ingress').constructor

#### Defined in

[lib/k8s/cluster.ts:107](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L107)

## Properties

### apiEndpoint

▪ `Static` **apiEndpoint**: `Object`

#### Index signature

▪ [other: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `scale?` | { `get`: (`namespace`: `string`, `name`: `string`) => `Promise`<`any`\> ; `put`: (`body`: { `metadata`: [`KubeMetadata`](../interfaces/lib_k8s_cluster.KubeMetadata.md) ; `spec`: { `replicas`: `number`  }  }) => `Promise`<`any`\>  } |
| `scale.get` | (`namespace`: `string`, `name`: `string`) => `Promise`<`any`\> |
| `scale.put` | (`body`: { `metadata`: [`KubeMetadata`](../interfaces/lib_k8s_cluster.KubeMetadata.md) ; `spec`: { `replicas`: `number`  }  }) => `Promise`<`any`\> |

#### Defined in

[lib/k8s/ingress.ts:72](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/ingress.ts#L72)

___

### className

▪ `Static` **className**: `string`

#### Inherited from

makeKubeObject<KubeIngress\>('ingress').className

#### Defined in

[lib/k8s/cluster.ts:108](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L108)

## Accessors

### spec

• `get` **spec**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `defaultBackend?` | { `resource?`: { `apiVersion`: `string` ; `kind`: `string` ; `name`: `string`  } ; `service?`: { `name`: `string` ; `port`: { `name?`: `string` ; `number?`: `number`  }  }  } |
| `defaultBackend.resource?` | { `apiVersion`: `string` ; `kind`: `string` ; `name`: `string`  } |
| `defaultBackend.resource.apiVersion` | `string` |
| `defaultBackend.resource.kind` | `string` |
| `defaultBackend.resource.name` | `string` |
| `defaultBackend.service?` | { `name`: `string` ; `port`: { `name?`: `string` ; `number?`: `number`  }  } |
| `defaultBackend.service.name` | `string` |
| `defaultBackend.service.port` | { `name?`: `string` ; `number?`: `number`  } |
| `defaultBackend.service.port.name?` | `string` |
| `defaultBackend.service.port.number?` | `number` |
| `ingressClassName?` | `string` |
| `rules` | [`IngressRule`](../interfaces/lib_k8s_ingress.IngressRule.md)[] \| `LegacyIngressRule`[] |
| `tls?` | { `hosts`: `string`[] ; `secretName`: `string`  }[] |

#### Defined in

[lib/k8s/ingress.ts:79](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/ingress.ts#L79)

___

### listRoute

• `Static` `get` **listRoute**(): `string`

#### Returns

`string`

#### Defined in

[lib/k8s/ingress.ts:126](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/ingress.ts#L126)

___

### pluralName

• `Static` `get` **pluralName**(): `string`

#### Returns

`string`

#### Defined in

[lib/k8s/ingress.ts:130](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/ingress.ts#L130)

## Methods

### getHosts

▸ **getHosts**(): `string`

#### Returns

`string`

#### Defined in

[lib/k8s/ingress.ts:83](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/ingress.ts#L83)

___

### getRules

▸ **getRules**(): [`IngressRule`](../interfaces/lib_k8s_ingress.IngressRule.md)[]

#### Returns

[`IngressRule`](../interfaces/lib_k8s_ingress.IngressRule.md)[]

#### Defined in

[lib/k8s/ingress.ts:87](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/ingress.ts#L87)

___

### apiList

▸ `Static` **apiList**(`onList`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `onList` | (`arg`: `any`[]) => `void` |

#### Returns

`any`

#### Inherited from

makeKubeObject<KubeIngress\>('ingress').apiList

#### Defined in

[lib/k8s/cluster.ts:87](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L87)

___

### getAuthorization

▸ `Static` `Optional` **getAuthorization**(`arg`, `resourceAttrs?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg` | `string` |
| `resourceAttrs?` | [`AuthRequestResourceAttrs`](../interfaces/lib_k8s_cluster.AuthRequestResourceAttrs.md) |

#### Returns

`any`

#### Inherited from

makeKubeObject<KubeIngress\>('ingress').getAuthorization

#### Defined in

[lib/k8s/cluster.ts:110](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L110)

___

### getErrorMessage

▸ `Static` **getErrorMessage**(`err?`): ``null`` \| `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err?` | ``null`` \| [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md) |

#### Returns

``null`` \| `string`

#### Inherited from

makeKubeObject<KubeIngress\>('ingress').getErrorMessage

#### Defined in

[lib/k8s/cluster.ts:106](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L106)

___

### useApiGet

▸ `Static` **useApiGet**(`onGet`, `name`, `namespace?`, `onError?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `onGet` | (...`args`: `any`) => `void` |
| `name` | `string` |
| `namespace?` | `string` |
| `onError?` | (`err`: [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md)) => `void` |

#### Returns

`void`

#### Inherited from

makeKubeObject<KubeIngress\>('ingress').useApiGet

#### Defined in

[lib/k8s/cluster.ts:93](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L93)

___

### useApiList

▸ `Static` **useApiList**(`onList`, `onError?`, `opts?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `onList` | (`arg`: `any`[]) => `void` |
| `onError?` | (`err`: [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md)) => `void` |
| `opts?` | [`ApiListOptions`](../interfaces/lib_k8s_cluster.ApiListOptions.md) |

#### Returns

`any`

#### Inherited from

makeKubeObject<KubeIngress\>('ingress').useApiList

#### Defined in

[lib/k8s/cluster.ts:88](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L88)

___

### useGet

▸ `Static` **useGet**(`name`, `namespace?`): [`any`, ``null`` \| [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md), (`item`: `any`) => `void`, (`err`: ``null`` \| [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md)) => `void`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `namespace?` | `string` |

#### Returns

[`any`, ``null`` \| [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md), (`item`: `any`) => `void`, (`err`: ``null`` \| [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md)) => `void`]

#### Inherited from

makeKubeObject<KubeIngress\>('ingress').useGet

#### Defined in

[lib/k8s/cluster.ts:102](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L102)

___

### useList

▸ `Static` **useList**(`opts?`): [`any`[], ``null`` \| [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md), (`items`: `any`[]) => `void`, (`err`: ``null`` \| [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md)) => `void`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts?` | [`ApiListOptions`](../interfaces/lib_k8s_cluster.ApiListOptions.md) |

#### Returns

[`any`[], ``null`` \| [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md), (`items`: `any`[]) => `void`, (`err`: ``null`` \| [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md)) => `void`]

#### Inherited from

makeKubeObject<KubeIngress\>('ingress').useList

#### Defined in

[lib/k8s/cluster.ts:99](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L99)
