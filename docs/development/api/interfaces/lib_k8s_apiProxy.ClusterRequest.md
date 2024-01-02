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

[lib/k8s/apiProxy.ts:56](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/apiProxy.ts#L56)

___

### insecureTLSVerify

• `Optional` **insecureTLSVerify**: `boolean`

Whether the server's certificate should not be checked for validity

#### Defined in

[lib/k8s/apiProxy.ts:54](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/apiProxy.ts#L54)

___

### kubeconfig

• `Optional` **kubeconfig**: `string`

KubeConfig (base64 encoded)

#### Defined in

[lib/k8s/apiProxy.ts:58](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/apiProxy.ts#L58)

___

### name

• `Optional` **name**: `string`

The name of the cluster (has to be unique, or it will override an existing cluster)

#### Defined in

[lib/k8s/apiProxy.ts:50](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/apiProxy.ts#L50)

___

### server

• `Optional` **server**: `string`

The cluster URL

#### Defined in

[lib/k8s/apiProxy.ts:52](https://github.com/headlamp-k8s/headlamp/blob/b0236780/frontend/src/lib/k8s/apiProxy.ts#L52)
