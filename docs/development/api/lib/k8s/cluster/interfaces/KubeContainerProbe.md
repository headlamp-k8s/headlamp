# Interface: KubeContainerProbe

## Properties

### exec?

```ts
optional exec: object;
```

#### command

```ts
command: string[];
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:475](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L475)

***

### failureThreshold?

```ts
optional failureThreshold: number;
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:485](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L485)

***

### httpGet?

```ts
optional httpGet: object;
```

#### host?

```ts
optional host: string;
```

#### path?

```ts
optional path: string;
```

#### port

```ts
port: number;
```

#### scheme

```ts
scheme: string;
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:469](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L469)

***

### initialDelaySeconds?

```ts
optional initialDelaySeconds: number;
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:481](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L481)

***

### periodSeconds?

```ts
optional periodSeconds: number;
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:483](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L483)

***

### successThreshold?

```ts
optional successThreshold: number;
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:484](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L484)

***

### tcpSocket?

```ts
optional tcpSocket: object;
```

#### port

```ts
port: number;
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:478](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L478)

***

### timeoutSeconds?

```ts
optional timeoutSeconds: number;
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:482](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L482)
