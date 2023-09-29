---
title: "Class: Node"
linkTitle: "Node"
slug: "lib_k8s_node.Node"
---

[lib/k8s/node](../modules/lib_k8s_node.md).Node

## Hierarchy

- `any`

  ↳ **`Node`**

## Constructors

### constructor

• **new Node**(`json`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | [`KubeNode`](../interfaces/lib_k8s_node.KubeNode.md) |

#### Inherited from

makeKubeObject<KubeNode\>('node').constructor

#### Defined in

[lib/k8s/cluster.ts:107](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L107)

## Properties

### apiEndpoint

▪ `Static` **apiEndpoint**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `delete` | (`name`: `string`, `queryParams?`: [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md)) => `Promise`<`any`\> |
| `get` | (`name`: `string`, `cb`: [`StreamResultsCb`](../modules/lib_k8s_apiProxy.md#streamresultscb), `errCb`: [`StreamErrCb`](../modules/lib_k8s_apiProxy.md#streamerrcb), `queryParams?`: [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md)) => `Promise`<() => `void`\> |
| `isNamespaced` | `boolean` |
| `list` | (`cb`: [`StreamResultsCb`](../modules/lib_k8s_apiProxy.md#streamresultscb), `errCb`: [`StreamErrCb`](../modules/lib_k8s_apiProxy.md#streamerrcb), `queryParams?`: [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md)) => `Promise`<() => `void`\> |
| `patch` | (`body`: `OpPatch`[], `name`: `string`, `queryParams?`: [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md)) => `Promise`<`any`\> |
| `post` | (`body`: [`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md), `queryParams?`: [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md)) => `Promise`<`any`\> |
| `put` | (`body`: [`KubeObjectInterface`](../interfaces/lib_k8s_cluster.KubeObjectInterface.md), `queryParams?`: [`QueryParameters`](../interfaces/lib_k8s_apiProxy.QueryParameters.md)) => `Promise`<`any`\> |

#### Defined in

[lib/k8s/node.ts:40](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/node.ts#L40)

___

### className

▪ `Static` **className**: `string`

#### Inherited from

makeKubeObject<KubeNode\>('node').className

#### Defined in

[lib/k8s/cluster.ts:108](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L108)

## Accessors

### spec

• `get` **spec**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `podCIDR` | `string` |

#### Defined in

[lib/k8s/node.ts:46](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/node.ts#L46)

___

### status

• `get` **status**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `addresses` | { `address`: `string` ; `type`: `string`  }[] |
| `capacity` | { `cpu`: `any` ; `memory`: `any`  } |
| `capacity.cpu` | `any` |
| `capacity.memory` | `any` |
| `conditions` | `Omit`<[`KubeCondition`](../interfaces/lib_k8s_cluster.KubeCondition.md), ``"lastProbeTime"`` \| ``"lastUpdateTime"``\> & { `lastHeartbeatTime`: `string`  }[] |
| `nodeInfo` | { `architecture`: `string` ; `bootID`: `string` ; `containerRuntimeVersion`: `string` ; `kernelVersion`: `string` ; `kubeProxyVersion`: `string` ; `kubeletVersion`: `string` ; `machineID`: `string` ; `operatingSystem`: `string` ; `osImage`: `string` ; `systemUUID`: `string`  } |
| `nodeInfo.architecture` | `string` |
| `nodeInfo.bootID` | `string` |
| `nodeInfo.containerRuntimeVersion` | `string` |
| `nodeInfo.kernelVersion` | `string` |
| `nodeInfo.kubeProxyVersion` | `string` |
| `nodeInfo.kubeletVersion` | `string` |
| `nodeInfo.machineID` | `string` |
| `nodeInfo.operatingSystem` | `string` |
| `nodeInfo.osImage` | `string` |
| `nodeInfo.systemUUID` | `string` |

#### Defined in

[lib/k8s/node.ts:42](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/node.ts#L42)

## Methods

### getExternalIP

▸ **getExternalIP**(): `string`

#### Returns

`string`

#### Defined in

[lib/k8s/node.ts:67](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/node.ts#L67)

___

### getInternalIP

▸ **getInternalIP**(): `string`

#### Returns

`string`

#### Defined in

[lib/k8s/node.ts:71](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/node.ts#L71)

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

makeKubeObject<KubeNode\>('node').apiList

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

makeKubeObject<KubeNode\>('node').getAuthorization

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

makeKubeObject<KubeNode\>('node').getErrorMessage

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

makeKubeObject<KubeNode\>('node').useApiGet

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

makeKubeObject<KubeNode\>('node').useApiList

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

makeKubeObject<KubeNode\>('node').useGet

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

makeKubeObject<KubeNode\>('node').useList

#### Defined in

[lib/k8s/cluster.ts:99](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L99)

___

### useMetrics

▸ `Static` **useMetrics**(): [``null`` \| [`KubeMetrics`](../interfaces/lib_k8s_cluster.KubeMetrics.md)[], ``null`` \| [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md)]

#### Returns

[``null`` \| [`KubeMetrics`](../interfaces/lib_k8s_cluster.KubeMetrics.md)[], ``null`` \| [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md)]

#### Defined in

[lib/k8s/node.ts:50](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/node.ts#L50)
