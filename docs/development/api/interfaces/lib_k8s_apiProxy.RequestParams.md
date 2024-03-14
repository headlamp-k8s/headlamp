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

[lib/k8s/apiProxy.ts:50](https://github.com/headlamp-k8s/headlamp/blob/2ce94491/frontend/src/lib/k8s/apiProxy.ts#L50)

___

### cluster

• `Optional` **cluster**: ``null`` \| `string`

Cluster context name.

#### Defined in

[lib/k8s/apiProxy.ts:48](https://github.com/headlamp-k8s/headlamp/blob/2ce94491/frontend/src/lib/k8s/apiProxy.ts#L48)

___

### isJSON

• `Optional` **isJSON**: `boolean`

Is the request expected to receive JSON data?

#### Defined in

[lib/k8s/apiProxy.ts:46](https://github.com/headlamp-k8s/headlamp/blob/2ce94491/frontend/src/lib/k8s/apiProxy.ts#L46)

___

### timeout

• `Optional` **timeout**: `number`

Number of milliseconds to wait for a response.

#### Defined in

[lib/k8s/apiProxy.ts:44](https://github.com/headlamp-k8s/headlamp/blob/2ce94491/frontend/src/lib/k8s/apiProxy.ts#L44)
