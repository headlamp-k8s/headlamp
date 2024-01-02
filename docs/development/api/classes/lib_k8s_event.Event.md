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

[lib/k8s/cluster.ts:301](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/cluster.ts#L301)

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

[lib/k8s/event.ts:24](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/event.ts#L24)

___

### className

▪ `Static` **className**: `string`

#### Inherited from

makeKubeObject<KubeEvent\>('Event').className

#### Defined in

[lib/k8s/cluster.ts:302](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/cluster.ts#L302)

## Accessors

### involvedObject

• `get` **involvedObject**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/event.ts:47](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/event.ts#L47)

___

### involvedObjectInstance

• `get` **involvedObjectInstance**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/event.ts:93](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/event.ts#L93)

___

### message

• `get` **message**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/event.ts:59](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/event.ts#L59)

___

### reason

• `get` **reason**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/event.ts:55](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/event.ts#L55)

___

### spec

• `get` **spec**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/event.ts:39](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/event.ts#L39)

___

### status

• `get` **status**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/event.ts:43](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/event.ts#L43)

___

### type

• `get` **type**(): `any`

#### Returns

`any`

#### Defined in

[lib/k8s/event.ts:51](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/event.ts#L51)

___

### maxLimit

• `Static` `get` **maxLimit**(): `number`

#### Returns

`number`

#### Defined in

[lib/k8s/event.ts:30](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/event.ts#L30)

• `Static` `set` **maxLimit**(`limit`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `limit` | `number` |

#### Returns

`void`

#### Defined in

[lib/k8s/event.ts:35](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/event.ts#L35)

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

[lib/k8s/cluster.ts:281](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/cluster.ts#L281)

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

makeKubeObject<KubeEvent\>('Event').getAuthorization

#### Defined in

[lib/k8s/cluster.ts:304](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/cluster.ts#L304)

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

[lib/k8s/cluster.ts:300](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/cluster.ts#L300)

___

### objectEvents

▸ `Static` **objectEvents**(`object`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `object` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[lib/k8s/event.ts:63](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/event.ts#L63)

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

[lib/k8s/cluster.ts:287](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/cluster.ts#L287)

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

[lib/k8s/cluster.ts:282](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/cluster.ts#L282)

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

makeKubeObject<KubeEvent\>('Event').useGet

#### Defined in

[lib/k8s/cluster.ts:296](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/cluster.ts#L296)

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

[lib/k8s/cluster.ts:293](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/cluster.ts#L293)
