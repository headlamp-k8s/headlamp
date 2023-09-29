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

Additional WebSocket protocols to use when connecting.

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[additionalProtocols](lib_k8s_apiProxy.StreamArgs.md#additionalprotocols)

#### Defined in

[lib/k8s/apiProxy.ts:836](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L836)

___

### command

• `Optional` **command**: `string`[]

#### Defined in

[lib/k8s/pod.ts:41](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/pod.ts#L41)

___

### isJson

• `Optional` **isJson**: `boolean`

Whether the stream is expected to receive JSON data.

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[isJson](lib_k8s_apiProxy.StreamArgs.md#isjson)

#### Defined in

[lib/k8s/apiProxy.ts:834](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L834)

___

### reconnectOnFailure

• `Optional` **reconnectOnFailure**: `boolean`

Whether to attempt to reconnect the WebSocket connection if it fails.

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[reconnectOnFailure](lib_k8s_apiProxy.StreamArgs.md#reconnectonfailure)

#### Defined in

[lib/k8s/apiProxy.ts:840](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L840)

___

### stderr

• `Optional` **stderr**: `boolean`

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[stderr](lib_k8s_apiProxy.StreamArgs.md#stderr)

#### Defined in

[lib/k8s/apiProxy.ts:846](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L846)

___

### stdin

• `Optional` **stdin**: `boolean`

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[stdin](lib_k8s_apiProxy.StreamArgs.md#stdin)

#### Defined in

[lib/k8s/apiProxy.ts:844](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L844)

___

### stdout

• `Optional` **stdout**: `boolean`

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[stdout](lib_k8s_apiProxy.StreamArgs.md#stdout)

#### Defined in

[lib/k8s/apiProxy.ts:845](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L845)

___

### tty

• `Optional` **tty**: `boolean`

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[tty](lib_k8s_apiProxy.StreamArgs.md#tty)

#### Defined in

[lib/k8s/apiProxy.ts:843](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L843)

## Methods

### connectCb

▸ `Optional` **connectCb**(): `void`

A callback function to execute when the WebSocket connection is established.

#### Returns

`void`

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[connectCb](lib_k8s_apiProxy.StreamArgs.md#connectcb)

#### Defined in

[lib/k8s/apiProxy.ts:838](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L838)

___

### failCb

▸ `Optional` **failCb**(): `void`

A callback function to execute when the WebSocket connection fails.

#### Returns

`void`

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[failCb](lib_k8s_apiProxy.StreamArgs.md#failcb)

#### Defined in

[lib/k8s/apiProxy.ts:842](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L842)
