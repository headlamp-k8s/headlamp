---
title: "Interface: RequestParams"
linkTitle: "RequestParams"
slug: "lib_k8s_apiProxy.RequestParams"
---

[lib/k8s/apiProxy](../modules/lib_k8s_apiProxy.md).RequestParams

Options for the request.

## Hierarchy

- `RequestInit`

  ↳ **`RequestParams`**

  ↳↳ [`ClusterRequestParams`](lib_k8s_apiProxy.ClusterRequestParams.md)

## Properties

### autoLogoutOnAuthError

• `Optional` **autoLogoutOnAuthError**: `boolean`

Whether to automatically log out the user if there is an authentication error.

#### Defined in

[lib/k8s/apiProxy.ts:45](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/apiProxy.ts#L45)

___

### cluster

• `Optional` **cluster**: ``null`` \| `string`

Cluster context name.

#### Defined in

[lib/k8s/apiProxy.ts:43](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/apiProxy.ts#L43)

___

### isJSON

• `Optional` **isJSON**: `boolean`

Is the request expected to receive JSON data?

#### Defined in

[lib/k8s/apiProxy.ts:41](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/apiProxy.ts#L41)

___

### timeout

• `Optional` **timeout**: `number`

Number of milliseconds to wait for a response.

#### Defined in

[lib/k8s/apiProxy.ts:39](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/apiProxy.ts#L39)
