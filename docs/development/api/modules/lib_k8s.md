---
title: "Module: lib/k8s"
linkTitle: "lib/k8s"
slug: "lib_k8s"
---

## Variables

### ResourceClasses

• **ResourceClasses**: `Object` = `resourceClassesDict`

#### Index signature

▪ [className: `string`]: `KubeObject`

#### Defined in

[lib/k8s/index.ts:73](https://github.com/kinvolk/headlamp/blob/d0c9391/frontend/src/lib/k8s/index.ts#L73)

## Functions

### getVersion

▸ **getVersion**(): `Promise`<`StringDict`\>

#### Returns

`Promise`<`StringDict`\>

#### Defined in

[lib/k8s/index.ts:145](https://github.com/kinvolk/headlamp/blob/d0c9391/frontend/src/lib/k8s/index.ts#L145)

___

### useCluster

▸ **useCluster**(): ``null`` \| `string`

#### Returns

``null`` \| `string`

#### Defined in

[lib/k8s/index.ts:128](https://github.com/kinvolk/headlamp/blob/d0c9391/frontend/src/lib/k8s/index.ts#L128)

___

### useClustersConf

▸ **useClustersConf**(): `ConfigState`[``"clusters"``]

#### Returns

`ConfigState`[``"clusters"``]

#### Defined in

[lib/k8s/index.ts:80](https://github.com/kinvolk/headlamp/blob/d0c9391/frontend/src/lib/k8s/index.ts#L80)

___

### useConnectApi

▸ **useConnectApi**(...`apiCalls`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...apiCalls` | () => `CancellablePromise`[] |

#### Returns

`void`

#### Defined in

[lib/k8s/index.ts:151](https://github.com/kinvolk/headlamp/blob/d0c9391/frontend/src/lib/k8s/index.ts#L151)
