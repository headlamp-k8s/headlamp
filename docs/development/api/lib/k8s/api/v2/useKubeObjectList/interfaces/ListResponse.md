# Interface: ListResponse\<K\>

Object representing a List of Kube object
with information about which cluster and namespace it came from

## Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* [`KubeObject`](../../../../KubeObject/classes/KubeObject.md) |

## Properties

### cluster

```ts
cluster: string;
```

Cluster of the list

#### Defined in

[frontend/src/lib/k8s/api/v2/useKubeObjectList.ts:21](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/useKubeObjectList.ts#L21)

***

### list

```ts
list: KubeList<K>;
```

KubeList with items

#### Defined in

[frontend/src/lib/k8s/api/v2/useKubeObjectList.ts:19](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/useKubeObjectList.ts#L19)

***

### namespace?

```ts
optional namespace: string;
```

If the list only has items from one namespace

#### Defined in

[frontend/src/lib/k8s/api/v2/useKubeObjectList.ts:23](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/useKubeObjectList.ts#L23)
