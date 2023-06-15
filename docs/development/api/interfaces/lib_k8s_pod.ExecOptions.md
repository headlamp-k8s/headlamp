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

[lib/k8s/apiProxy.ts:665](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/apiProxy.ts#L665)

___

### command

• `Optional` **command**: `string`[]

#### Defined in

[lib/k8s/pod.ts:36](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/pod.ts#L36)

___

### isJson

• `Optional` **isJson**: `boolean`

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[isJson](lib_k8s_apiProxy.StreamArgs.md#isjson)

#### Defined in

[lib/k8s/apiProxy.ts:664](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/apiProxy.ts#L664)

___

### reconnectOnFailure

• `Optional` **reconnectOnFailure**: `boolean`

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[reconnectOnFailure](lib_k8s_apiProxy.StreamArgs.md#reconnectonfailure)

#### Defined in

[lib/k8s/apiProxy.ts:667](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/apiProxy.ts#L667)

## Methods

### connectCb

▸ `Optional` **connectCb**(): `void`

#### Returns

`void`

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[connectCb](lib_k8s_apiProxy.StreamArgs.md#connectcb)

#### Defined in

[lib/k8s/apiProxy.ts:666](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/apiProxy.ts#L666)

___

### failCb

▸ `Optional` **failCb**(): `void`

#### Returns

`void`

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[failCb](lib_k8s_apiProxy.StreamArgs.md#failcb)

#### Defined in

[lib/k8s/apiProxy.ts:668](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/lib/k8s/apiProxy.ts#L668)
