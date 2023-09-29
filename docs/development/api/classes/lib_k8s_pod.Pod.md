---
title: "Class: Pod"
linkTitle: "Pod"
slug: "lib_k8s_pod.Pod"
---

[lib/k8s/pod](../modules/lib_k8s_pod.md).Pod

## Hierarchy

- `any`

  ↳ **`Pod`**

## Constructors

### constructor

• **new Pod**(`jsonData`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `jsonData` | [`KubePod`](../interfaces/lib_k8s_pod.KubePod.md) |

#### Overrides

makeKubeObject&lt;KubePod\&gt;(&#x27;Pod&#x27;).constructor

#### Defined in

[lib/k8s/pod.ts:83](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/pod.ts#L83)

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

[lib/k8s/pod.ts:80](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/pod.ts#L80)

___

### className

▪ `Static` **className**: `string`

#### Inherited from

makeKubeObject<KubePod\>('Pod').className

#### Defined in

[lib/k8s/cluster.ts:108](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L108)

## Accessors

### spec

• `get` **spec**(): [`KubePodSpec`](../interfaces/lib_k8s_pod.KubePodSpec.md)

#### Returns

[`KubePodSpec`](../interfaces/lib_k8s_pod.KubePodSpec.md)

#### Defined in

[lib/k8s/pod.ts:88](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/pod.ts#L88)

___

### status

• `get` **status**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `conditions` | [`KubeCondition`](../interfaces/lib_k8s_cluster.KubeCondition.md)[] |
| `containerStatuses` | [`KubeContainerStatus`](../interfaces/lib_k8s_cluster.KubeContainerStatus.md)[] |
| `hostIP` | `string` |
| `initContainerStatuses?` | [`KubeContainerStatus`](../interfaces/lib_k8s_cluster.KubeContainerStatus.md)[] |
| `message?` | `string` |
| `phase` | `string` |
| `qosClass?` | `string` |
| `reason?` | `string` |
| `startTime` | [`Time`](../modules/lib_k8s_cluster.md#time) |

#### Defined in

[lib/k8s/pod.ts:92](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/pod.ts#L92)

## Methods

### attach

▸ **attach**(`container`, `onAttach`, `options?`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `container` | `string` |
| `onAttach` | [`StreamResultsCb`](../modules/lib_k8s_apiProxy.md#streamresultscb) |
| `options` | [`StreamArgs`](../interfaces/lib_k8s_apiProxy.StreamArgs.md) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `cancel` | () => `void` |
| `getSocket` | () => ``null`` \| `WebSocket` |

#### Defined in

[lib/k8s/pod.ts:138](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/pod.ts#L138)

___

### exec

▸ **exec**(`container`, `onExec`, `options?`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `container` | `string` |
| `onExec` | [`StreamResultsCb`](../modules/lib_k8s_apiProxy.md#streamresultscb) |
| `options` | [`ExecOptions`](../interfaces/lib_k8s_pod.ExecOptions.md) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `cancel` | () => `void` |
| `getSocket` | () => ``null`` \| `WebSocket` |

#### Defined in

[lib/k8s/pod.ts:150](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/pod.ts#L150)

___

### getDetailedStatus

▸ **getDetailedStatus**(): `PodDetailedStatus`

#### Returns

`PodDetailedStatus`

#### Defined in

[lib/k8s/pod.ts:188](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/pod.ts#L188)

___

### getLogs

▸ **getLogs**(...`args`): () => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [container: string, tailLines: number, showPrevious: boolean, onLogs: StreamResultsCb] \| [container: string, onLogs: StreamResultsCb, logsOptions: LogOptions] |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[lib/k8s/pod.ts:96](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/pod.ts#L96)

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

makeKubeObject<KubePod\>('Pod').apiList

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

makeKubeObject<KubePod\>('Pod').getAuthorization

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

makeKubeObject<KubePod\>('Pod').getErrorMessage

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

makeKubeObject<KubePod\>('Pod').useApiGet

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

makeKubeObject<KubePod\>('Pod').useApiList

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

makeKubeObject<KubePod\>('Pod').useGet

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

makeKubeObject<KubePod\>('Pod').useList

#### Defined in

[lib/k8s/cluster.ts:99](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L99)
