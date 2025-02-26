# Interface: KubeEndpointAddress

## Properties

### hostname

```ts
hostname: string;
```

#### Defined in

[frontend/src/lib/k8s/endpoints.ts:12](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/endpoints.ts#L12)

***

### ip

```ts
ip: string;
```

#### Defined in

[frontend/src/lib/k8s/endpoints.ts:13](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/endpoints.ts#L13)

***

### nodeName?

```ts
optional nodeName: string;
```

#### Defined in

[frontend/src/lib/k8s/endpoints.ts:14](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/endpoints.ts#L14)

***

### targetRef?

```ts
optional targetRef: Pick<KubeObjectInterface, "kind" | "apiVersion"> & Pick<KubeMetadata, "name" | "resourceVersion" | "namespace" | "uid"> & object;
```

#### Type declaration

##### fieldPath

```ts
fieldPath: string;
```

#### Defined in

[frontend/src/lib/k8s/endpoints.ts:15](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/endpoints.ts#L15)
