# Interface: StreamArgs

Configure a stream with... StreamArgs.

## Extended by

- [`ExecOptions`](../../../../pod/interfaces/ExecOptions.md)

## Properties

### additionalProtocols?

```ts
optional additionalProtocols: string[];
```

Additional WebSocket protocols to use when connecting.

#### Defined in

[frontend/src/lib/k8s/api/v1/streamingApi.ts:251](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/streamingApi.ts#L251)

***

### cluster?

```ts
optional cluster: string;
```

#### Defined in

[frontend/src/lib/k8s/api/v1/streamingApi.ts:262](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/streamingApi.ts#L262)

***

### connectCb()?

```ts
optional connectCb: () => void;
```

A callback function to execute when the WebSocket connection is established.

#### Returns

`void`

#### Defined in

[frontend/src/lib/k8s/api/v1/streamingApi.ts:253](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/streamingApi.ts#L253)

***

### failCb()?

```ts
optional failCb: () => void;
```

A callback function to execute when the WebSocket connection fails.

#### Returns

`void`

#### Defined in

[frontend/src/lib/k8s/api/v1/streamingApi.ts:257](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/streamingApi.ts#L257)

***

### isJson?

```ts
optional isJson: boolean;
```

Whether the stream is expected to receive JSON data.

#### Defined in

[frontend/src/lib/k8s/api/v1/streamingApi.ts:249](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/streamingApi.ts#L249)

***

### reconnectOnFailure?

```ts
optional reconnectOnFailure: boolean;
```

Whether to attempt to reconnect the WebSocket connection if it fails.

#### Defined in

[frontend/src/lib/k8s/api/v1/streamingApi.ts:255](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/streamingApi.ts#L255)

***

### stderr?

```ts
optional stderr: boolean;
```

#### Defined in

[frontend/src/lib/k8s/api/v1/streamingApi.ts:261](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/streamingApi.ts#L261)

***

### stdin?

```ts
optional stdin: boolean;
```

#### Defined in

[frontend/src/lib/k8s/api/v1/streamingApi.ts:259](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/streamingApi.ts#L259)

***

### stdout?

```ts
optional stdout: boolean;
```

#### Defined in

[frontend/src/lib/k8s/api/v1/streamingApi.ts:260](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/streamingApi.ts#L260)

***

### tty?

```ts
optional tty: boolean;
```

#### Defined in

[frontend/src/lib/k8s/api/v1/streamingApi.ts:258](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/streamingApi.ts#L258)
