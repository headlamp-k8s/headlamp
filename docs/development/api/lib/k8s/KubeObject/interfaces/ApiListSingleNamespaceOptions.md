# Interface: ApiListSingleNamespaceOptions

## Properties

### cluster?

```ts
optional cluster: string;
```

The cluster to get the object from. By default uses the current cluster being viewed.

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:668](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L668)

***

### namespace?

```ts
optional namespace: string;
```

The namespace to get the object from.

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:664](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L664)

***

### queryParams?

```ts
optional queryParams: QueryParameters;
```

The parameters to be passed to the API endpoint.

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:666](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L666)
