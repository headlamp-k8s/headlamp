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

[lib/k8s/apiProxy.ts:836](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L836)

___

### isJson

• `Optional` **isJson**: `boolean`

Whether the stream is expected to receive JSON data.

#### Defined in

[lib/k8s/apiProxy.ts:834](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L834)

___

### reconnectOnFailure

• `Optional` **reconnectOnFailure**: `boolean`

Whether to attempt to reconnect the WebSocket connection if it fails.

#### Defined in

[lib/k8s/apiProxy.ts:840](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L840)

___

### stderr

• `Optional` **stderr**: `boolean`

#### Defined in

[lib/k8s/apiProxy.ts:846](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L846)

___

### stdin

• `Optional` **stdin**: `boolean`

#### Defined in

[lib/k8s/apiProxy.ts:844](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L844)

___

### stdout

• `Optional` **stdout**: `boolean`

#### Defined in

[lib/k8s/apiProxy.ts:845](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L845)

___

### tty

• `Optional` **tty**: `boolean`

#### Defined in

[lib/k8s/apiProxy.ts:843](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L843)

## Methods

### connectCb

▸ `Optional` **connectCb**(): `void`

A callback function to execute when the WebSocket connection is established.

#### Returns

`void`

#### Defined in

[lib/k8s/apiProxy.ts:838](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L838)

___

### failCb

▸ `Optional` **failCb**(): `void`

A callback function to execute when the WebSocket connection fails.

#### Returns

`void`

#### Defined in

[lib/k8s/apiProxy.ts:842](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L842)
