# Interface: KubeListUpdateEvent\<T\>

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`KubeObjectInterface`](../../../../KubeObject/interfaces/KubeObjectInterface.md) |

## Properties

### object

```ts
object: T;
```

#### Defined in

[frontend/src/lib/k8s/api/v2/KubeList.ts:14](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/KubeList.ts#L14)

***

### type

```ts
type: "ERROR" | "ADDED" | "MODIFIED" | "DELETED";
```

#### Defined in

[frontend/src/lib/k8s/api/v2/KubeList.ts:13](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/KubeList.ts#L13)
