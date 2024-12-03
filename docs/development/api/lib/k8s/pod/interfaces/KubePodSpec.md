# Interface: KubePodSpec

## Properties

### containers

```ts
containers: KubeContainer[];
```

#### Defined in

[frontend/src/lib/k8s/pod.ts:12](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/pod.ts#L12)

***

### ephemeralContainers?

```ts
optional ephemeralContainers: KubeContainer[];
```

#### Defined in

[frontend/src/lib/k8s/pod.ts:18](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/pod.ts#L18)

***

### initContainers?

```ts
optional initContainers: KubeContainer[];
```

#### Defined in

[frontend/src/lib/k8s/pod.ts:17](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/pod.ts#L17)

***

### nodeName

```ts
nodeName: string;
```

#### Defined in

[frontend/src/lib/k8s/pod.ts:13](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/pod.ts#L13)

***

### nodeSelector?

```ts
optional nodeSelector: object;
```

#### Index Signature

 \[`key`: `string`\]: `string`

#### Defined in

[frontend/src/lib/k8s/pod.ts:14](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/pod.ts#L14)

***

### priority?

```ts
optional priority: string;
```

#### Defined in

[frontend/src/lib/k8s/pod.ts:25](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/pod.ts#L25)

***

### readinessGates?

```ts
optional readinessGates: object[];
```

#### conditionType

```ts
conditionType: string;
```

#### Defined in

[frontend/src/lib/k8s/pod.ts:19](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/pod.ts#L19)

***

### serviceAccount?

```ts
optional serviceAccount: string;
```

#### Defined in

[frontend/src/lib/k8s/pod.ts:24](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/pod.ts#L24)

***

### serviceAccountName?

```ts
optional serviceAccountName: string;
```

#### Defined in

[frontend/src/lib/k8s/pod.ts:23](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/pod.ts#L23)

***

### tolerations?

```ts
optional tolerations: any[];
```

#### Defined in

[frontend/src/lib/k8s/pod.ts:26](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/pod.ts#L26)

***

### volumes?

```ts
optional volumes: KubeVolume[];
```

#### Defined in

[frontend/src/lib/k8s/pod.ts:22](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/pod.ts#L22)
