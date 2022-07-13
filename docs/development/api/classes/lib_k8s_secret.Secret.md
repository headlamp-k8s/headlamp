---
title: "Class: Secret"
linkTitle: "Secret"
slug: "lib_k8s_secret.Secret"
---

[lib/k8s/secret](../modules/lib_k8s_secret.md).Secret

## Hierarchy

- `any`

  ↳ **`Secret`**

## Constructors

### constructor

• **new Secret**(`json`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | [`KubeSecret`](../interfaces/lib_k8s_secret.KubeSecret.md) |

#### Inherited from

makeKubeObject<KubeSecret\>('secret').constructor

#### Defined in

[lib/k8s/cluster.ts:76](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L76)

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

[lib/k8s/secret.ts:10](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/secret.ts#L10)

___

### className

▪ `Static` **className**: `string`

#### Inherited from

makeKubeObject<KubeSecret\>('secret').className

#### Defined in

[lib/k8s/cluster.ts:77](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L77)

## Accessors

### data

• `get` **data**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/secret.ts:12](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/secret.ts#L12)

___

### type

• `get` **type**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/secret.ts:16](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/secret.ts#L16)

## Methods

### apiList

▸ `Static` **apiList**(`onList`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `onList` | (`arg`: `any`[]) => `void` |

#### Returns

`any`

#### Inherited from

makeKubeObject<KubeSecret\>('secret').apiList

#### Defined in

[lib/k8s/cluster.ts:60](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L60)

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

makeKubeObject<KubeSecret\>('secret').getErrorMessage

#### Defined in

[lib/k8s/cluster.ts:75](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L75)

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

makeKubeObject<KubeSecret\>('secret').useApiGet

#### Defined in

[lib/k8s/cluster.ts:66](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L66)

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

makeKubeObject<KubeSecret\>('secret').useApiList

#### Defined in

[lib/k8s/cluster.ts:61](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L61)

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

makeKubeObject<KubeSecret\>('secret').useList

#### Defined in

[lib/k8s/cluster.ts:72](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L72)
