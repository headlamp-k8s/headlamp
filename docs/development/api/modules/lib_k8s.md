---
title: "Module: lib/k8s"
linkTitle: "lib/k8s"
slug: "lib_k8s"
---

## Type aliases

### CancellablePromise

Ƭ **CancellablePromise**: `Promise`<() => `void`\>

#### Defined in

[lib/k8s/index.ts:149](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/index.ts#L149)

## Variables

### ResourceClasses

• **ResourceClasses**: `Object` = `resourceClassesDict`

#### Index signature

▪ [className: `string`]: [`KubeObject`](lib_k8s_cluster.md#kubeobject)

#### Defined in

[lib/k8s/index.ts:73](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/index.ts#L73)

## Functions

### getVersion

▸ **getVersion**(): `Promise`<[`StringDict`](../interfaces/lib_k8s_cluster.StringDict.md)\>

#### Returns

`Promise`<[`StringDict`](../interfaces/lib_k8s_cluster.StringDict.md)\>

#### Defined in

[lib/k8s/index.ts:145](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/index.ts#L145)

___

### useCluster

▸ **useCluster**(): ``null`` \| `string`

#### Returns

``null`` \| `string`

#### Defined in

[lib/k8s/index.ts:128](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/index.ts#L128)

___

### useClustersConf

▸ **useClustersConf**(): [`ConfigState`](../interfaces/redux_reducers_config.ConfigState.md)[``"clusters"``]

#### Returns

[`ConfigState`](../interfaces/redux_reducers_config.ConfigState.md)[``"clusters"``]

#### Defined in

[lib/k8s/index.ts:80](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/index.ts#L80)

___

### useConnectApi

▸ **useConnectApi**(...`apiCalls`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...apiCalls` | () => [`CancellablePromise`](lib_k8s.md#cancellablepromise)[] |

#### Returns

`void`

#### Defined in

[lib/k8s/index.ts:151](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/index.ts#L151)
