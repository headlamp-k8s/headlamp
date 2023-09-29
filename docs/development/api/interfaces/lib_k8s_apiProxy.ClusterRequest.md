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

[lib/k8s/apiProxy.ts:47](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L47)

___

### insecureTLSVerify

• `Optional` **insecureTLSVerify**: `boolean`

Whether the server's certificate should not be checked for validity

#### Defined in

[lib/k8s/apiProxy.ts:45](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L45)

___

### kubeconfig

• `Optional` **kubeconfig**: `string`

KubeConfig (base64 encoded)

#### Defined in

[lib/k8s/apiProxy.ts:49](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L49)

___

### name

• `Optional` **name**: `string`

The name of the cluster (has to be unique, or it will override an existing cluster)

#### Defined in

[lib/k8s/apiProxy.ts:41](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L41)

___

### server

• `Optional` **server**: `string`

The cluster URL

#### Defined in

[lib/k8s/apiProxy.ts:43](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/apiProxy.ts#L43)
