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

[lib/k8s/apiProxy.ts:615](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/apiProxy.ts#L615)

___

### command

• `Optional` **command**: `string`[]

#### Defined in

[lib/k8s/pod.ts:33](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/pod.ts#L33)

___

### isJson

• `Optional` **isJson**: `boolean`

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[isJson](lib_k8s_apiProxy.StreamArgs.md#isjson)

#### Defined in

[lib/k8s/apiProxy.ts:614](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/apiProxy.ts#L614)

___

### reconnectOnFailure

• `Optional` **reconnectOnFailure**: `boolean`

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[reconnectOnFailure](lib_k8s_apiProxy.StreamArgs.md#reconnectonfailure)

#### Defined in

[lib/k8s/apiProxy.ts:617](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/apiProxy.ts#L617)

## Methods

### connectCb

▸ `Optional` **connectCb**(): `void`

#### Returns

`void`

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[connectCb](lib_k8s_apiProxy.StreamArgs.md#connectcb)

#### Defined in

[lib/k8s/apiProxy.ts:616](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/apiProxy.ts#L616)

___

### failCb

▸ `Optional` **failCb**(): `void`

#### Returns

`void`

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[failCb](lib_k8s_apiProxy.StreamArgs.md#failcb)

#### Defined in

[lib/k8s/apiProxy.ts:618](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/apiProxy.ts#L618)
