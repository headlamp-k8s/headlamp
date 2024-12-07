# Interface: KubeContainerStatus

## Properties

### containerID?

```ts
optional containerID: string;
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:533](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L533)

***

### image

```ts
image: string;
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:534](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L534)

***

### imageID

```ts
imageID: string;
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:535](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L535)

***

### lastState

```ts
lastState: Partial<ContainerState>;
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:539](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L539)

***

### name

```ts
name: string;
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:536](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L536)

***

### ready

```ts
ready: boolean;
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:537](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L537)

***

### restartCount

```ts
restartCount: number;
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:538](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L538)

***

### started?

```ts
optional started: boolean;
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:541](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L541)

***

### state

```ts
state: Partial<ContainerState>;
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:540](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L540)
