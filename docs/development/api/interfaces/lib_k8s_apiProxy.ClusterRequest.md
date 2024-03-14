---
title: "Interface: ClusterRequest"
linkTitle: "ClusterRequest"
slug: "lib_k8s_apiProxy.ClusterRequest"
---

[lib/k8s/apiProxy](../modules/lib_k8s_apiProxy.md).ClusterRequest

## Properties

### certificateAuthorityData

• `Optional` **certificateAuthorityData**: `string`

The certificate authority data

#### Defined in

[lib/k8s/apiProxy.ts:61](https://github.com/headlamp-k8s/headlamp/blob/2ce94491/frontend/src/lib/k8s/apiProxy.ts#L61)

___

### insecureTLSVerify

• `Optional` **insecureTLSVerify**: `boolean`

Whether the server's certificate should not be checked for validity

#### Defined in

[lib/k8s/apiProxy.ts:59](https://github.com/headlamp-k8s/headlamp/blob/2ce94491/frontend/src/lib/k8s/apiProxy.ts#L59)

___

### kubeconfig

• `Optional` **kubeconfig**: `string`

KubeConfig (base64 encoded)

#### Defined in

[lib/k8s/apiProxy.ts:63](https://github.com/headlamp-k8s/headlamp/blob/2ce94491/frontend/src/lib/k8s/apiProxy.ts#L63)

___

### name

• `Optional` **name**: `string`

The name of the cluster (has to be unique, or it will override an existing cluster)

#### Defined in

[lib/k8s/apiProxy.ts:55](https://github.com/headlamp-k8s/headlamp/blob/2ce94491/frontend/src/lib/k8s/apiProxy.ts#L55)

___

### server

• `Optional` **server**: `string`

The cluster URL

#### Defined in

[lib/k8s/apiProxy.ts:57](https://github.com/headlamp-k8s/headlamp/blob/2ce94491/frontend/src/lib/k8s/apiProxy.ts#L57)
