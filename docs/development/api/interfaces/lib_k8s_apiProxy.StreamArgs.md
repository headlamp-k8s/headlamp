---
title: "Interface: StreamArgs"
linkTitle: "StreamArgs"
slug: "lib_k8s_apiProxy.StreamArgs"
---

[lib/k8s/apiProxy](../modules/lib_k8s_apiProxy.md).StreamArgs

Configure a stream with... StreamArgs.

## Hierarchy

- **`StreamArgs`**

  ↳ [`ExecOptions`](lib_k8s_pod.ExecOptions.md)

## Properties

### additionalProtocols

• `Optional` **additionalProtocols**: `string`[]

Additional WebSocket protocols to use when connecting.

#### Defined in

[lib/k8s/apiProxy.ts:1098](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/apiProxy.ts#L1098)

___

### isJson

• `Optional` **isJson**: `boolean`

Whether the stream is expected to receive JSON data.

#### Defined in

[lib/k8s/apiProxy.ts:1096](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/apiProxy.ts#L1096)

___

### reconnectOnFailure

• `Optional` **reconnectOnFailure**: `boolean`

Whether to attempt to reconnect the WebSocket connection if it fails.

#### Defined in

[lib/k8s/apiProxy.ts:1102](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/apiProxy.ts#L1102)

___

### stderr

• `Optional` **stderr**: `boolean`

#### Defined in

[lib/k8s/apiProxy.ts:1108](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/apiProxy.ts#L1108)

___

### stdin

• `Optional` **stdin**: `boolean`

#### Defined in

[lib/k8s/apiProxy.ts:1106](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/apiProxy.ts#L1106)

___

### stdout

• `Optional` **stdout**: `boolean`

#### Defined in

[lib/k8s/apiProxy.ts:1107](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/apiProxy.ts#L1107)

___

### tty

• `Optional` **tty**: `boolean`

#### Defined in

[lib/k8s/apiProxy.ts:1105](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/apiProxy.ts#L1105)

## Methods

### connectCb

▸ `Optional` **connectCb**(): `void`

A callback function to execute when the WebSocket connection is established.

#### Returns

`void`

#### Defined in

[lib/k8s/apiProxy.ts:1100](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/apiProxy.ts#L1100)

___

### failCb

▸ `Optional` **failCb**(): `void`

A callback function to execute when the WebSocket connection fails.

#### Returns

`void`

#### Defined in

[lib/k8s/apiProxy.ts:1104](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/apiProxy.ts#L1104)
