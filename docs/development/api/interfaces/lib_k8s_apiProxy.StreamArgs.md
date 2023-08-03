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

[lib/k8s/apiProxy.ts:808](https://github.com/headlamp-k8s/headlamp/blob/1ae27053/frontend/src/lib/k8s/apiProxy.ts#L808)

___

### isJson

• `Optional` **isJson**: `boolean`

Whether the stream is expected to receive JSON data.

#### Defined in

[lib/k8s/apiProxy.ts:806](https://github.com/headlamp-k8s/headlamp/blob/1ae27053/frontend/src/lib/k8s/apiProxy.ts#L806)

___

### reconnectOnFailure

• `Optional` **reconnectOnFailure**: `boolean`

Whether to attempt to reconnect the WebSocket connection if it fails.

#### Defined in

[lib/k8s/apiProxy.ts:812](https://github.com/headlamp-k8s/headlamp/blob/1ae27053/frontend/src/lib/k8s/apiProxy.ts#L812)

___

### stderr

• `Optional` **stderr**: `boolean`

#### Defined in

[lib/k8s/apiProxy.ts:818](https://github.com/headlamp-k8s/headlamp/blob/1ae27053/frontend/src/lib/k8s/apiProxy.ts#L818)

___

### stdin

• `Optional` **stdin**: `boolean`

#### Defined in

[lib/k8s/apiProxy.ts:816](https://github.com/headlamp-k8s/headlamp/blob/1ae27053/frontend/src/lib/k8s/apiProxy.ts#L816)

___

### stdout

• `Optional` **stdout**: `boolean`

#### Defined in

[lib/k8s/apiProxy.ts:817](https://github.com/headlamp-k8s/headlamp/blob/1ae27053/frontend/src/lib/k8s/apiProxy.ts#L817)

___

### tty

• `Optional` **tty**: `boolean`

#### Defined in

[lib/k8s/apiProxy.ts:815](https://github.com/headlamp-k8s/headlamp/blob/1ae27053/frontend/src/lib/k8s/apiProxy.ts#L815)

## Methods

### connectCb

▸ `Optional` **connectCb**(): `void`

A callback function to execute when the WebSocket connection is established.

#### Returns

`void`

#### Defined in

[lib/k8s/apiProxy.ts:810](https://github.com/headlamp-k8s/headlamp/blob/1ae27053/frontend/src/lib/k8s/apiProxy.ts#L810)

___

### failCb

▸ `Optional` **failCb**(): `void`

A callback function to execute when the WebSocket connection fails.

#### Returns

`void`

#### Defined in

[lib/k8s/apiProxy.ts:814](https://github.com/headlamp-k8s/headlamp/blob/1ae27053/frontend/src/lib/k8s/apiProxy.ts#L814)
