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

[lib/k8s/apiProxy.ts:1262](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1262)

___

### cluster

• `Optional` **cluster**: `string`

#### Defined in

[lib/k8s/apiProxy.ts:1273](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1273)

___

### isJson

• `Optional` **isJson**: `boolean`

Whether the stream is expected to receive JSON data.

#### Defined in

[lib/k8s/apiProxy.ts:1260](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1260)

___

### reconnectOnFailure

• `Optional` **reconnectOnFailure**: `boolean`

Whether to attempt to reconnect the WebSocket connection if it fails.

#### Defined in

[lib/k8s/apiProxy.ts:1266](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1266)

___

### stderr

• `Optional` **stderr**: `boolean`

#### Defined in

[lib/k8s/apiProxy.ts:1272](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1272)

___

### stdin

• `Optional` **stdin**: `boolean`

#### Defined in

[lib/k8s/apiProxy.ts:1270](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1270)

___

### stdout

• `Optional` **stdout**: `boolean`

#### Defined in

[lib/k8s/apiProxy.ts:1271](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1271)

___

### tty

• `Optional` **tty**: `boolean`

#### Defined in

[lib/k8s/apiProxy.ts:1269](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1269)

## Methods

### connectCb

▸ `Optional` **connectCb**(): `void`

A callback function to execute when the WebSocket connection is established.

#### Returns

`void`

#### Defined in

[lib/k8s/apiProxy.ts:1264](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1264)

___

### failCb

▸ `Optional` **failCb**(): `void`

A callback function to execute when the WebSocket connection fails.

#### Returns

`void`

#### Defined in

[lib/k8s/apiProxy.ts:1268](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L1268)
