# Type Alias: WebSocketConnectionRequest\<T\>

```ts
type WebSocketConnectionRequest<T>: object;
```

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Type declaration

### cluster

```ts
cluster: string;
```

### onMessage()

```ts
onMessage: (data: T) => void;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `T` |

#### Returns

`void`

### url

```ts
url: string;
```

## Defined in

[frontend/src/lib/k8s/api/v2/webSocket.ts:129](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/webSocket.ts#L129)
