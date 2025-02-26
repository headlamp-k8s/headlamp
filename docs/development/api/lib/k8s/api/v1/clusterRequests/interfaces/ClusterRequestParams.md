# Interface: ClusterRequestParams

The options for `clusterRequest`.

## Extends

- [`RequestParams`](RequestParams.md)

## Properties

### autoLogoutOnAuthError?

```ts
optional autoLogoutOnAuthError: boolean;
```

Whether to automatically log out the user if there is an authentication error.

#### Overrides

[`RequestParams`](RequestParams.md).[`autoLogoutOnAuthError`](RequestParams.md#autologoutonautherror)

#### Defined in

[frontend/src/lib/k8s/api/v1/clusterRequests.ts:50](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/clusterRequests.ts#L50)

***

### cluster?

```ts
optional cluster: null | string;
```

Cluster context name.

#### Overrides

[`RequestParams`](RequestParams.md).[`cluster`](RequestParams.md#cluster)

#### Defined in

[frontend/src/lib/k8s/api/v1/clusterRequests.ts:49](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/clusterRequests.ts#L49)

***

### isJSON?

```ts
optional isJSON: boolean;
```

Is the request expected to receive JSON data?

#### Inherited from

[`RequestParams`](RequestParams.md).[`isJSON`](RequestParams.md#isjson)

#### Defined in

[frontend/src/lib/k8s/api/v1/clusterRequests.ts:25](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/clusterRequests.ts#L25)

***

### timeout?

```ts
optional timeout: number;
```

Number of milliseconds to wait for a response.

#### Inherited from

[`RequestParams`](RequestParams.md).[`timeout`](RequestParams.md#timeout)

#### Defined in

[frontend/src/lib/k8s/api/v1/clusterRequests.ts:23](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/clusterRequests.ts#L23)
