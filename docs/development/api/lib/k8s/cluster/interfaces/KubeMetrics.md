# Interface: KubeMetrics

## Properties

### metadata

```ts
metadata: KubeMetadata;
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:500](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L500)

***

### status

```ts
status: object;
```

#### capacity

```ts
capacity: object;
```

##### capacity.cpu

```ts
cpu: string;
```

##### capacity.memory

```ts
memory: string;
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:505](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L505)

***

### usage

```ts
usage: object;
```

#### cpu

```ts
cpu: string;
```

#### memory

```ts
memory: string;
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:501](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L501)
