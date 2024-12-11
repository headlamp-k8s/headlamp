# Interface: KubeNode

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

### spec

```ts
spec: object;
```

#### Index Signature

 \[`otherProps`: `string`\]: `any`

#### podCIDR

```ts
podCIDR: string;
```

#### taints

```ts
taints: object[];
```

#### Overrides

[`KubeObjectInterface`](../../KubeObject/interfaces/KubeObjectInterface.md).[`spec`](../../KubeObject/interfaces/KubeObjectInterface.md#spec)

#### Defined in

[frontend/src/lib/k8s/node.ts:46](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/node.ts#L46)

***

### status

```ts
status: object;
```

#### addresses

```ts
addresses: object[];
```

#### allocatable

```ts
allocatable: object;
```

##### allocatable.cpu

```ts
cpu: any;
```

##### allocatable.ephemeralStorage

```ts
ephemeralStorage: any;
```

##### allocatable.hugepages\_1Gi

```ts
hugepages_1Gi: any;
```

##### allocatable.hugepages\_2Mi

```ts
hugepages_2Mi: any;
```

##### allocatable.memory

```ts
memory: any;
```

##### allocatable.pods

```ts
pods: any;
```

#### capacity

```ts
capacity: object;
```

##### capacity.cpu

```ts
cpu: any;
```

##### capacity.ephemeralStorage

```ts
ephemeralStorage: any;
```

##### capacity.hugepages\_1Gi

```ts
hugepages_1Gi: any;
```

##### capacity.hugepages\_2Mi

```ts
hugepages_2Mi: any;
```

##### capacity.memory

```ts
memory: any;
```

##### capacity.pods

```ts
pods: any;
```

#### conditions

```ts
conditions: Omit<KubeCondition, "lastProbeTime" | "lastUpdateTime"> & object[];
```

#### nodeInfo

```ts
nodeInfo: object;
```

##### nodeInfo.architecture

```ts
architecture: string;
```

##### nodeInfo.bootID

```ts
bootID: string;
```

##### nodeInfo.containerRuntimeVersion

```ts
containerRuntimeVersion: string;
```

##### nodeInfo.kernelVersion

```ts
kernelVersion: string;
```

##### nodeInfo.kubeletVersion

```ts
kubeletVersion: string;
```

##### nodeInfo.kubeProxyVersion

```ts
kubeProxyVersion: string;
```

##### nodeInfo.machineID

```ts
machineID: string;
```

##### nodeInfo.operatingSystem

```ts
operatingSystem: string;
```

##### nodeInfo.osImage

```ts
osImage: string;
```

##### nodeInfo.systemUUID

```ts
systemUUID: string;
```

#### Overrides

[`KubeObjectInterface`](../../KubeObject/interfaces/KubeObjectInterface.md).[`status`](../../KubeObject/interfaces/KubeObjectInterface.md#status)

#### Defined in

[frontend/src/lib/k8s/node.ts:9](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/node.ts#L9)
