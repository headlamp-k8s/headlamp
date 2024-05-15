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

[lib/k8s/apiProxy.ts:325](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L325)

___

### cluster

• `Optional` **cluster**: ``null`` \| `string`

Cluster context name.

#### Overrides

[RequestParams](lib_k8s_apiProxy.RequestParams.md).[cluster](lib_k8s_apiProxy.RequestParams.md#cluster)

#### Defined in

[lib/k8s/apiProxy.ts:324](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L324)

___

### isJSON

• `Optional` **isJSON**: `boolean`

Is the request expected to receive JSON data?

#### Inherited from

[RequestParams](lib_k8s_apiProxy.RequestParams.md).[isJSON](lib_k8s_apiProxy.RequestParams.md#isjson)

#### Defined in

[lib/k8s/apiProxy.ts:62](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L62)

___

### timeout

• `Optional` **timeout**: `number`

Number of milliseconds to wait for a response.

#### Inherited from

[RequestParams](lib_k8s_apiProxy.RequestParams.md).[timeout](lib_k8s_apiProxy.RequestParams.md#timeout)

#### Defined in

[lib/k8s/apiProxy.ts:60](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/apiProxy.ts#L60)
