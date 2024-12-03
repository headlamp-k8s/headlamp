# Interface: LimitRangeSpec

## Properties

### limits

```ts
limits: object[];
```

#### default

```ts
default: object;
```

##### default.cpu

```ts
cpu: string;
```

##### default.memory

```ts
memory: string;
```

#### defaultRequest

```ts
defaultRequest: object;
```

##### defaultRequest.cpu

```ts
cpu: string;
```

##### defaultRequest.memory

```ts
memory: string;
```

#### max

```ts
max: object;
```

##### max.cpu

```ts
cpu: string;
```

##### max.memory

```ts
memory: string;
```

#### min

```ts
min: object;
```

##### min.cpu

```ts
cpu: string;
```

##### min.memory

```ts
memory: string;
```

#### type

```ts
type: string;
```

#### Defined in

[frontend/src/lib/k8s/limitRange.tsx:4](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/limitRange.tsx#L4)
