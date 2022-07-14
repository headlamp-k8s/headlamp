---
title: "Interface: ExecOptions"
linkTitle: "ExecOptions"
slug: "lib_k8s_pod.ExecOptions"
---

[lib/k8s/pod](../modules/lib_k8s_pod.md).ExecOptions

## Hierarchy

- [`StreamArgs`](lib_k8s_apiProxy.StreamArgs.md)

  ↳ **`ExecOptions`**

## Properties

### additionalProtocols

• `Optional` **additionalProtocols**: `string`[]

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[additionalProtocols](lib_k8s_apiProxy.StreamArgs.md#additionalprotocols)

#### Defined in

[lib/k8s/apiProxy.ts:611](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/apiProxy.ts#L611)

___

### command

• `Optional` **command**: `string`[]

#### Defined in

[lib/k8s/pod.ts:33](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/pod.ts#L33)

___

### isJson

• `Optional` **isJson**: `boolean`

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[isJson](lib_k8s_apiProxy.StreamArgs.md#isjson)

#### Defined in

[lib/k8s/apiProxy.ts:610](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/apiProxy.ts#L610)

___

### reconnectOnFailure

• `Optional` **reconnectOnFailure**: `boolean`

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[reconnectOnFailure](lib_k8s_apiProxy.StreamArgs.md#reconnectonfailure)

#### Defined in

[lib/k8s/apiProxy.ts:613](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/apiProxy.ts#L613)

## Methods

### connectCb

▸ `Optional` **connectCb**(): `void`

#### Returns

`void`

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[connectCb](lib_k8s_apiProxy.StreamArgs.md#connectcb)

#### Defined in

[lib/k8s/apiProxy.ts:612](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/apiProxy.ts#L612)

___

### failCb

▸ `Optional` **failCb**(): `void`

#### Returns

`void`

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[failCb](lib_k8s_apiProxy.StreamArgs.md#failcb)

#### Defined in

[lib/k8s/apiProxy.ts:614](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/apiProxy.ts#L614)
