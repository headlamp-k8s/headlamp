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

[lib/k8s/apiProxy.ts:43](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/apiProxy.ts#L43)

___

### insecureTLSVerify

• `Optional` **insecureTLSVerify**: `boolean`

Whether the server's certificate should not be checked for validity

#### Defined in

[lib/k8s/apiProxy.ts:41](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/apiProxy.ts#L41)

___

### name

• **name**: `string`

The name of the cluster (has to be unique, or it will override an existing cluster)

#### Defined in

[lib/k8s/apiProxy.ts:37](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/apiProxy.ts#L37)

___

### server

• **server**: `string`

The cluster URL

#### Defined in

[lib/k8s/apiProxy.ts:39](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/apiProxy.ts#L39)
