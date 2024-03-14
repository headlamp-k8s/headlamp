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

[lib/k8s/apiProxy.ts:1239](https://github.com/headlamp-k8s/headlamp/blob/2ce94491/frontend/src/lib/k8s/apiProxy.ts#L1239)

___

### cluster

• `Optional` **cluster**: `string`

#### Defined in

[lib/k8s/apiProxy.ts:1250](https://github.com/headlamp-k8s/headlamp/blob/2ce94491/frontend/src/lib/k8s/apiProxy.ts#L1250)

___

### isJson

• `Optional` **isJson**: `boolean`

Whether the stream is expected to receive JSON data.

#### Defined in

[lib/k8s/apiProxy.ts:1237](https://github.com/headlamp-k8s/headlamp/blob/2ce94491/frontend/src/lib/k8s/apiProxy.ts#L1237)

___

### reconnectOnFailure

• `Optional` **reconnectOnFailure**: `boolean`

Whether to attempt to reconnect the WebSocket connection if it fails.

#### Defined in

[lib/k8s/apiProxy.ts:1243](https://github.com/headlamp-k8s/headlamp/blob/2ce94491/frontend/src/lib/k8s/apiProxy.ts#L1243)

___

### stderr

• `Optional` **stderr**: `boolean`

#### Defined in

[lib/k8s/apiProxy.ts:1249](https://github.com/headlamp-k8s/headlamp/blob/2ce94491/frontend/src/lib/k8s/apiProxy.ts#L1249)

___

### stdin

• `Optional` **stdin**: `boolean`

#### Defined in

[lib/k8s/apiProxy.ts:1247](https://github.com/headlamp-k8s/headlamp/blob/2ce94491/frontend/src/lib/k8s/apiProxy.ts#L1247)

___

### stdout

• `Optional` **stdout**: `boolean`

#### Defined in

[lib/k8s/apiProxy.ts:1248](https://github.com/headlamp-k8s/headlamp/blob/2ce94491/frontend/src/lib/k8s/apiProxy.ts#L1248)

___

### tty

• `Optional` **tty**: `boolean`

#### Defined in

[lib/k8s/apiProxy.ts:1246](https://github.com/headlamp-k8s/headlamp/blob/2ce94491/frontend/src/lib/k8s/apiProxy.ts#L1246)

## Methods

### connectCb

▸ `Optional` **connectCb**(): `void`

A callback function to execute when the WebSocket connection is established.

#### Returns

`void`

#### Defined in

[lib/k8s/apiProxy.ts:1241](https://github.com/headlamp-k8s/headlamp/blob/2ce94491/frontend/src/lib/k8s/apiProxy.ts#L1241)

___

### failCb

▸ `Optional` **failCb**(): `void`

A callback function to execute when the WebSocket connection fails.

#### Returns

`void`

#### Defined in

[lib/k8s/apiProxy.ts:1245](https://github.com/headlamp-k8s/headlamp/blob/2ce94491/frontend/src/lib/k8s/apiProxy.ts#L1245)
