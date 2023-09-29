---
title: "Class: Service"
linkTitle: "Service"
slug: "lib_k8s_service.Service"
---

[lib/k8s/service](../modules/lib_k8s_service.md).Service

## Hierarchy

- `any`

  ↳ **`Service`**

## Constructors

### constructor

• **new Service**(`json`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | [`KubeService`](../interfaces/lib_k8s_service.KubeService.md) |

#### Inherited from

makeKubeObject<KubeService\>('service').constructor

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

[lib/k8s/service.ts:43](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/service.ts#L43)

___

### className

▪ `Static` **className**: `string`

#### Inherited from

makeKubeObject<KubeService\>('service').className

#### Defined in

[lib/k8s/cluster.ts:108](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L108)

## Accessors

### spec

• `get` **spec**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `clusterIP` | `string` |
| `externalIPs` | `string`[] |
| `ports` | { `name`: `string` ; `nodePort`: `number` ; `port`: `number` ; `protocol`: `string` ; `targetPort`: `string` \| `number`  }[] |
| `selector` | { `[key: string]`: `string`;  } |
| `type` | `string` |

#### Defined in

[lib/k8s/service.ts:45](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/service.ts#L45)

___

### status

• `get` **status**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/service.ts:49](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/service.ts#L49)

## Methods

### getExternalAddresses

▸ **getExternalAddresses**(): `string`

#### Returns

`string`

#### Defined in

[lib/k8s/service.ts:53](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/service.ts#L53)

___

### getPorts

▸ **getPorts**(): `number`[]

#### Returns

`number`[]

#### Defined in

[lib/k8s/service.ts:63](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/service.ts#L63)

___

### getSelector

▸ **getSelector**(): `string`[]

#### Returns

`string`[]

#### Defined in

[lib/k8s/service.ts:67](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/service.ts#L67)

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

makeKubeObject<KubeService\>('service').apiList

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

makeKubeObject<KubeService\>('service').getAuthorization

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

makeKubeObject<KubeService\>('service').getErrorMessage

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

makeKubeObject<KubeService\>('service').useApiGet

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

makeKubeObject<KubeService\>('service').useApiList

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

makeKubeObject<KubeService\>('service').useGet

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

makeKubeObject<KubeService\>('service').useList

#### Defined in

[lib/k8s/cluster.ts:99](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L99)
