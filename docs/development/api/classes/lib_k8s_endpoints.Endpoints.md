---
title: "Class: Endpoints"
linkTitle: "Endpoints"
slug: "lib_k8s_endpoints.Endpoints"
---

[lib/k8s/endpoints](../modules/lib_k8s_endpoints.md).Endpoints

## Hierarchy

- `any`

  ↳ **`Endpoints`**

## Constructors

### constructor

• **new Endpoints**(`json`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | [`KubeEndpoint`](../interfaces/lib_k8s_endpoints.KubeEndpoint.md) |

#### Inherited from

makeKubeObject<KubeEndpoint\>('endpoint').constructor

#### Defined in

[lib/k8s/cluster.ts:317](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/cluster.ts#L317)

## Properties

### apiEndpoint

▪ `Static` **apiEndpoint**: `Object`

#### Index signature

▪ [other: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `scale?` | { `get`: (`namespace`: `string`, `name`: `string`, `clusterName?`: `string`) => `Promise`<`any`\> ; `put`: (`body`: { `metadata`: [`KubeMetadata`](../interfaces/lib_k8s_cluster.KubeMetadata.md) ; `spec`: { `replicas`: `number`  }  }, `clusterName?`: `string`) => `Promise`<`any`\>  } |
| `scale.get` | (`namespace`: `string`, `name`: `string`, `clusterName?`: `string`) => `Promise`<`any`\> |
| `scale.put` | (`body`: { `metadata`: [`KubeMetadata`](../interfaces/lib_k8s_cluster.KubeMetadata.md) ; `spec`: { `replicas`: `number`  }  }, `clusterName?`: `string`) => `Promise`<`any`\> |

#### Defined in

[lib/k8s/endpoints.ts:32](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/endpoints.ts#L32)

___

### className

▪ `Static` **className**: `string`

#### Inherited from

makeKubeObject<KubeEndpoint\>('endpoint').className

#### Defined in

[lib/k8s/cluster.ts:318](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/cluster.ts#L318)

## Accessors

### spec

• `get` **spec**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/endpoints.ts:34](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/endpoints.ts#L34)

___

### status

• `get` **status**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/endpoints.ts:38](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/endpoints.ts#L38)

___

### subsets

• `get` **subsets**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/endpoints.ts:42](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/endpoints.ts#L42)

## Methods

### getAddresses

▸ **getAddresses**(): `string`[]

#### Returns

`string`[]

#### Defined in

[lib/k8s/endpoints.ts:50](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/endpoints.ts#L50)

___

### getAddressesText

▸ **getAddressesText**(): `string`

#### Returns

`string`

#### Defined in

[lib/k8s/endpoints.ts:46](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/endpoints.ts#L46)

___

### apiList

▸ `Static` **apiList**(`onList`, `onError?`, `opts?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `onList` | (`arg`: `any`[]) => `void` |
| `onError?` | (`err`: [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md)) => `void` |
| `opts?` | [`ApiListSingleNamespaceOptions`](../interfaces/lib_k8s_cluster.ApiListSingleNamespaceOptions.md) |

#### Returns

`any`

#### Inherited from

makeKubeObject<KubeEndpoint\>('endpoint').apiList

#### Defined in

[lib/k8s/cluster.ts:293](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/cluster.ts#L293)

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

makeKubeObject<KubeEndpoint\>('endpoint').getAuthorization

#### Defined in

[lib/k8s/cluster.ts:320](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/cluster.ts#L320)

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

makeKubeObject<KubeEndpoint\>('endpoint').getErrorMessage

#### Defined in

[lib/k8s/cluster.ts:316](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/cluster.ts#L316)

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

makeKubeObject<KubeEndpoint\>('endpoint').useApiGet

#### Defined in

[lib/k8s/cluster.ts:303](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/cluster.ts#L303)

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

makeKubeObject<KubeEndpoint\>('endpoint').useApiList

#### Defined in

[lib/k8s/cluster.ts:298](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/cluster.ts#L298)

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

makeKubeObject<KubeEndpoint\>('endpoint').useGet

#### Defined in

[lib/k8s/cluster.ts:312](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/cluster.ts#L312)

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

makeKubeObject<KubeEndpoint\>('endpoint').useList

#### Defined in

[lib/k8s/cluster.ts:309](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/cluster.ts#L309)
