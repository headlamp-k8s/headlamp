---
title: "Interface: ClusterRequestParams"
linkTitle: "ClusterRequestParams"
slug: "lib_k8s_apiProxy.ClusterRequestParams"
---

[lib/k8s/apiProxy](../modules/lib_k8s_apiProxy.md).ClusterRequestParams

The options for `clusterRequest`.

## Hierarchy

- [`RequestParams`](lib_k8s_apiProxy.RequestParams.md)

  ↳ **`ClusterRequestParams`**

## Properties

### autoLogoutOnAuthError

• `Optional` **autoLogoutOnAuthError**: `boolean`

Whether to automatically log out the user if there is an authentication error.

#### Overrides

[RequestParams](lib_k8s_apiProxy.RequestParams.md).[autoLogoutOnAuthError](lib_k8s_apiProxy.RequestParams.md#autologoutonautherror)

#### Defined in

[lib/k8s/apiProxy.ts:304](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/apiProxy.ts#L304)

___

### cluster

• `Optional` **cluster**: ``null`` \| `string`

Cluster context name.

#### Overrides

[RequestParams](lib_k8s_apiProxy.RequestParams.md).[cluster](lib_k8s_apiProxy.RequestParams.md#cluster)

#### Defined in

[lib/k8s/apiProxy.ts:303](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/apiProxy.ts#L303)

___

### isJSON

• `Optional` **isJSON**: `boolean`

Is the request expected to receive JSON data?

#### Inherited from

[RequestParams](lib_k8s_apiProxy.RequestParams.md).[isJSON](lib_k8s_apiProxy.RequestParams.md#isjson)

#### Defined in

[lib/k8s/apiProxy.ts:41](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/apiProxy.ts#L41)

___

### timeout

• `Optional` **timeout**: `number`

Number of milliseconds to wait for a response.

#### Inherited from

[RequestParams](lib_k8s_apiProxy.RequestParams.md).[timeout](lib_k8s_apiProxy.RequestParams.md#timeout)

#### Defined in

[lib/k8s/apiProxy.ts:39](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/apiProxy.ts#L39)
