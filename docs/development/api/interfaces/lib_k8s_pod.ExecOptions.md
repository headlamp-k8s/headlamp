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

[lib/k8s/apiProxy.ts:1262](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1262)

___

### cluster

• `Optional` **cluster**: `string`

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[cluster](lib_k8s_apiProxy.StreamArgs.md#cluster)

#### Defined in

[lib/k8s/apiProxy.ts:1273](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1273)

___

### command

• `Optional` **command**: `string`[]

#### Defined in

[lib/k8s/pod.ts:49](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/pod.ts#L49)

___

### isJson

• `Optional` **isJson**: `boolean`

Whether the stream is expected to receive JSON data.

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[isJson](lib_k8s_apiProxy.StreamArgs.md#isjson)

#### Defined in

[lib/k8s/apiProxy.ts:1260](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1260)

___

### reconnectOnFailure

• `Optional` **reconnectOnFailure**: `boolean`

Whether to attempt to reconnect the WebSocket connection if it fails.

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[reconnectOnFailure](lib_k8s_apiProxy.StreamArgs.md#reconnectonfailure)

#### Defined in

[lib/k8s/apiProxy.ts:1266](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1266)

___

### stderr

• `Optional` **stderr**: `boolean`

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[stderr](lib_k8s_apiProxy.StreamArgs.md#stderr)

#### Defined in

[lib/k8s/apiProxy.ts:1272](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1272)

___

### stdin

• `Optional` **stdin**: `boolean`

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[stdin](lib_k8s_apiProxy.StreamArgs.md#stdin)

#### Defined in

[lib/k8s/apiProxy.ts:1270](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1270)

___

### stdout

• `Optional` **stdout**: `boolean`

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[stdout](lib_k8s_apiProxy.StreamArgs.md#stdout)

#### Defined in

[lib/k8s/apiProxy.ts:1271](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1271)

___

### tty

• `Optional` **tty**: `boolean`

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[tty](lib_k8s_apiProxy.StreamArgs.md#tty)

#### Defined in

[lib/k8s/apiProxy.ts:1269](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1269)

## Methods

### connectCb

▸ `Optional` **connectCb**(): `void`

A callback function to execute when the WebSocket connection is established.

#### Returns

`void`

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[connectCb](lib_k8s_apiProxy.StreamArgs.md#connectcb)

#### Defined in

[lib/k8s/apiProxy.ts:1264](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1264)

___

### failCb

▸ `Optional` **failCb**(): `void`

A callback function to execute when the WebSocket connection fails.

#### Returns

`void`

#### Inherited from

[StreamArgs](lib_k8s_apiProxy.StreamArgs.md).[failCb](lib_k8s_apiProxy.StreamArgs.md#failcb)

#### Defined in

[lib/k8s/apiProxy.ts:1268](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1268)
