# Interface: KubePriorityClass

This is the base interface for all Kubernetes resources, i.e. it contains fields
that all Kubernetes resources have.

## Extends

- [`KubeObjectInterface`](../../KubeObject/interfaces/KubeObjectInterface.md)

## Indexable

 \[`otherProps`: `string`\]: `any`

## Properties

### actionType?

```ts
optional actionType: any;
```

#### Inherited from

[`KubeObjectInterface`](../../KubeObject/interfaces/KubeObjectInterface.md).[`actionType`](../../KubeObject/interfaces/KubeObjectInterface.md#actiontype)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:644](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L644)

***

### apiVersion?

```ts
optional apiVersion: string;
```

#### Inherited from

[`KubeObjectInterface`](../../KubeObject/interfaces/KubeObjectInterface.md).[`apiVersion`](../../KubeObject/interfaces/KubeObjectInterface.md#apiversion)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:639](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L639)

***

### description

```ts
description: string;
```

#### Defined in

[frontend/src/lib/k8s/priorityClass.ts:7](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/priorityClass.ts#L7)

***

### globalDefault?

```ts
optional globalDefault: null | boolean;
```

#### Defined in

[frontend/src/lib/k8s/priorityClass.ts:6](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/priorityClass.ts#L6)

***

### items?

```ts
optional items: any[];
```

#### Inherited from

[`KubeObjectInterface`](../../KubeObject/interfaces/KubeObjectInterface.md).[`items`](../../KubeObject/interfaces/KubeObjectInterface.md#items)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:643](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L643)

***

### key?

```ts
optional key: any;
```

#### Inherited from

[`KubeObjectInterface`](../../KubeObject/interfaces/KubeObjectInterface.md).[`key`](../../KubeObject/interfaces/KubeObjectInterface.md#key)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:646](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L646)

***

### kind

```ts
kind: string;
```

Kind is a string value representing the REST resource this object represents.
Servers may infer this from the endpoint the client submits requests to.

In CamelCase.

Cannot be updated.

#### See

[more info](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds)

#### Inherited from

[`KubeObjectInterface`](../../KubeObject/interfaces/KubeObjectInterface.md).[`kind`](../../KubeObject/interfaces/KubeObjectInterface.md#kind)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:638](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L638)

***

### lastTimestamp?

```ts
optional lastTimestamp: string;
```

#### Inherited from

[`KubeObjectInterface`](../../KubeObject/interfaces/KubeObjectInterface.md).[`lastTimestamp`](../../KubeObject/interfaces/KubeObjectInterface.md#lasttimestamp)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:645](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L645)

***

### metadata

```ts
metadata: KubeMetadata;
```

#### Inherited from

[`KubeObjectInterface`](../../KubeObject/interfaces/KubeObjectInterface.md).[`metadata`](../../KubeObject/interfaces/KubeObjectInterface.md#metadata)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:640](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L640)

***

### preemptionPolicy

```ts
preemptionPolicy: string;
```

#### Defined in

[frontend/src/lib/k8s/priorityClass.ts:5](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/priorityClass.ts#L5)

***

### spec?

```ts
optional spec: any;
```

#### Inherited from

[`KubeObjectInterface`](../../KubeObject/interfaces/KubeObjectInterface.md).[`spec`](../../KubeObject/interfaces/KubeObjectInterface.md#spec)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:641](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L641)

***

### status?

```ts
optional status: any;
```

#### Inherited from

[`KubeObjectInterface`](../../KubeObject/interfaces/KubeObjectInterface.md).[`status`](../../KubeObject/interfaces/KubeObjectInterface.md#status)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:642](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L642)

***

### value

```ts
value: number;
```

#### Defined in

[frontend/src/lib/k8s/priorityClass.ts:4](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/priorityClass.ts#L4)
