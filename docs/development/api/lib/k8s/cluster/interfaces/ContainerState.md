# Interface: ContainerState

## Properties

### running

```ts
running: object;
```

#### startedAt

```ts
startedAt: string;
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:514](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L514)

***

### terminated

```ts
terminated: object;
```

#### containerID

```ts
containerID: string;
```

#### exitCode

```ts
exitCode: number;
```

#### finishedAt

```ts
finishedAt: string;
```

#### message?

```ts
optional message: string;
```

#### reason

```ts
reason: string;
```

#### signal?

```ts
optional signal: number;
```

#### startedAt

```ts
startedAt: string;
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:517](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L517)

***

### waiting

```ts
waiting: object;
```

#### message?

```ts
optional message: string;
```

#### reason

```ts
reason: string;
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:526](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L526)
