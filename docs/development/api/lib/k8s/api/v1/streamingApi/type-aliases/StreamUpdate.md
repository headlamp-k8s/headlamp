# Type Alias: StreamUpdate\<T\>

```ts
type StreamUpdate<T>: object;
```

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `any` |

## Type declaration

### object

```ts
object: T;
```

### type

```ts
type: "ADDED" | "MODIFIED" | "DELETED" | "ERROR";
```

## Defined in

[frontend/src/lib/k8s/api/v1/streamingApi.ts:11](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/streamingApi.ts#L11)
