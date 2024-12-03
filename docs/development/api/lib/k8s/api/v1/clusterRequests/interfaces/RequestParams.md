# Interface: RequestParams

Options for the request.

## Extends

- `RequestInit`

## Extended by

- [`ClusterRequestParams`](ClusterRequestParams.md)

## Properties

### autoLogoutOnAuthError?

```ts
optional autoLogoutOnAuthError: boolean;
```

Whether to automatically log out the user if there is an authentication error.

#### Defined in

[frontend/src/lib/k8s/api/v1/clusterRequests.ts:29](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/clusterRequests.ts#L29)

***

### cluster?

```ts
optional cluster: null | string;
```

Cluster context name.

#### Defined in

[frontend/src/lib/k8s/api/v1/clusterRequests.ts:27](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/clusterRequests.ts#L27)

***

### isJSON?

```ts
optional isJSON: boolean;
```

Is the request expected to receive JSON data?

#### Defined in

[frontend/src/lib/k8s/api/v1/clusterRequests.ts:25](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/clusterRequests.ts#L25)

***

### timeout?

```ts
optional timeout: number;
```

Number of milliseconds to wait for a response.

#### Defined in

[frontend/src/lib/k8s/api/v1/clusterRequests.ts:23](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/clusterRequests.ts#L23)
