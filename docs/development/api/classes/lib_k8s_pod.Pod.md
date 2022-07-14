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

• **new Pod**(`json`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | [`KubePod`](../interfaces/lib_k8s_pod.KubePod.md) |

#### Inherited from

makeKubeObject<KubePod\>('Pod').constructor

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

[lib/k8s/pod.ts:61](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/pod.ts#L61)

___

### className

▪ `Static` **className**: `string`

#### Inherited from

makeKubeObject<KubePod\>('Pod').className

#### Defined in

[lib/k8s/cluster.ts:77](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L77)

## Accessors

### spec

• `get` **spec**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `containers` | [`KubeContainer`](../interfaces/lib_k8s_cluster.KubeContainer.md)[] |
| `nodeName` | `string` |
| `nodeSelector?` | { `[key: string]`: `string`;  } |

#### Defined in

[lib/k8s/pod.ts:63](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/pod.ts#L63)

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
| `message` | `string` |
| `phase` | `string` |
| `qosClass` | `string` |
| `reason` | `string` |
| `startTime` | `number` |

#### Defined in

[lib/k8s/pod.ts:67](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/pod.ts#L67)

## Methods

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

[lib/k8s/pod.ts:107](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/pod.ts#L107)

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

[lib/k8s/pod.ts:71](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/pod.ts#L71)

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

makeKubeObject<KubePod\>('Pod').getErrorMessage

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

makeKubeObject<KubePod\>('Pod').useApiGet

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

makeKubeObject<KubePod\>('Pod').useApiList

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

makeKubeObject<KubePod\>('Pod').useList

#### Defined in

[lib/k8s/cluster.ts:72](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L72)
