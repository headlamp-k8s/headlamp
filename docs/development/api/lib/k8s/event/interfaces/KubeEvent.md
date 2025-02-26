# Interface: KubeEvent

## Indexable

 \[`otherProps`: `string`\]: `any`

## Properties

### involvedObject

```ts
involvedObject: object;
```

#### apiVersion

```ts
apiVersion: string;
```

#### fieldPath

```ts
fieldPath: string;
```

#### kind

```ts
kind: string;
```

#### name

```ts
name: string;
```

#### namespace

```ts
namespace: string;
```

#### resourceVersion

```ts
resourceVersion: string;
```

#### uid

```ts
uid: string;
```

#### Defined in

[frontend/src/lib/k8s/event.ts:15](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/event.ts#L15)

***

### message

```ts
message: string;
```

#### Defined in

[frontend/src/lib/k8s/event.ts:13](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/event.ts#L13)

***

### metadata

```ts
metadata: KubeMetadata;
```

#### Defined in

[frontend/src/lib/k8s/event.ts:14](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/event.ts#L14)

***

### reason

```ts
reason: string;
```

#### Defined in

[frontend/src/lib/k8s/event.ts:12](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/event.ts#L12)

***

### type

```ts
type: string;
```

#### Defined in

[frontend/src/lib/k8s/event.ts:11](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/event.ts#L11)
