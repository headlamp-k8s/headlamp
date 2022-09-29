---
title: "Class: Event"
linkTitle: "Event"
slug: "lib_k8s_event.Event"
---

[lib/k8s/event](../modules/lib_k8s_event.md).Event

## Hierarchy

- `any`

  ↳ **`Event`**

## Constructors

### constructor

• **new Event**(`json`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | [`KubeEvent`](../interfaces/lib_k8s_event.KubeEvent.md) |

#### Inherited from

makeKubeObject<KubeEvent\>('Event').constructor

#### Defined in

[lib/k8s/cluster.ts:76](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L76)

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

[lib/k8s/event.ts:23](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/event.ts#L23)

___

### className

▪ `Static` **className**: `string`

#### Inherited from

makeKubeObject<KubeEvent\>('Event').className

#### Defined in

[lib/k8s/cluster.ts:77](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L77)

## Accessors

### involvedObject

• `get` **involvedObject**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/event.ts:33](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/event.ts#L33)

___

### involvedObjectInstance

• `get` **involvedObjectInstance**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/event.ts:49](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/event.ts#L49)

___

### message

• `get` **message**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/event.ts:45](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/event.ts#L45)

___

### reason

• `get` **reason**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/event.ts:41](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/event.ts#L41)

___

### spec

• `get` **spec**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/event.ts:25](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/event.ts#L25)

___

### status

• `get` **status**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/event.ts:29](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/event.ts#L29)

___

### type

• `get` **type**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/event.ts:37](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/event.ts#L37)

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

makeKubeObject<KubeEvent\>('Event').apiList

#### Defined in

[lib/k8s/cluster.ts:60](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L60)

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

makeKubeObject<KubeEvent\>('Event').getErrorMessage

#### Defined in

[lib/k8s/cluster.ts:75](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L75)

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

makeKubeObject<KubeEvent\>('Event').useApiGet

#### Defined in

[lib/k8s/cluster.ts:66](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L66)

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

makeKubeObject<KubeEvent\>('Event').useApiList

#### Defined in

[lib/k8s/cluster.ts:61](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L61)

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

makeKubeObject<KubeEvent\>('Event').useList

#### Defined in

[lib/k8s/cluster.ts:72](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L72)
