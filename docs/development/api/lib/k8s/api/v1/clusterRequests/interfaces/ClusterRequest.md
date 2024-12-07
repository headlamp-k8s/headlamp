# Interface: ClusterRequest

## Properties

### certificateAuthorityData?

```ts
optional certificateAuthorityData: string;
```

The certificate authority data

#### Defined in

[frontend/src/lib/k8s/api/v1/clusterRequests.ts:40](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/clusterRequests.ts#L40)

***

### insecureTLSVerify?

```ts
optional insecureTLSVerify: boolean;
```

Whether the server's certificate should not be checked for validity

#### Defined in

[frontend/src/lib/k8s/api/v1/clusterRequests.ts:38](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/clusterRequests.ts#L38)

***

### kubeconfig?

```ts
optional kubeconfig: string;
```

KubeConfig (base64 encoded)

#### Defined in

[frontend/src/lib/k8s/api/v1/clusterRequests.ts:42](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/clusterRequests.ts#L42)

***

### name?

```ts
optional name: string;
```

The name of the cluster (has to be unique, or it will override an existing cluster)

#### Defined in

[frontend/src/lib/k8s/api/v1/clusterRequests.ts:34](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/clusterRequests.ts#L34)

***

### server?

```ts
optional server: string;
```

The cluster URL

#### Defined in

[frontend/src/lib/k8s/api/v1/clusterRequests.ts:36](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/clusterRequests.ts#L36)
