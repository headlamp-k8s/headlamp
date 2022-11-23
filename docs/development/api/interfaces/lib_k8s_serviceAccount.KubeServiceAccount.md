---
title: "Interface: KubeServiceAccount"
linkTitle: "KubeServiceAccount"
slug: "lib_k8s_serviceAccount.KubeServiceAccount"
---

[lib/k8s/serviceAccount](../modules/lib_k8s_serviceAccount.md).KubeServiceAccount

## Hierarchy

- [`KubeObjectInterface`](lib_k8s_cluster.KubeObjectInterface.md)

  ↳ **`KubeServiceAccount`**

## Properties

### apiVersion

• `Optional` **apiVersion**: `string`

#### Inherited from

[KubeObjectInterface](lib_k8s_cluster.KubeObjectInterface.md).[apiVersion](lib_k8s_cluster.KubeObjectInterface.md#apiversion)

#### Defined in

[lib/k8s/cluster.ts:24](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L24)

___

### kind

• **kind**: `string`

#### Inherited from

[KubeObjectInterface](lib_k8s_cluster.KubeObjectInterface.md).[kind](lib_k8s_cluster.KubeObjectInterface.md#kind)

#### Defined in

[lib/k8s/cluster.ts:23](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L23)

___

### metadata

• **metadata**: [`KubeMetadata`](lib_k8s_cluster.KubeMetadata.md)

#### Inherited from

[KubeObjectInterface](lib_k8s_cluster.KubeObjectInterface.md).[metadata](lib_k8s_cluster.KubeObjectInterface.md#metadata)

#### Defined in

[lib/k8s/cluster.ts:25](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L25)

___

### secrets

• **secrets**: { `apiVersion`: `string` ; `fieldPath`: `string` ; `kind`: `string` ; `name`: `string` ; `namespace`: `string` ; `uid`: `string`  }[]

#### Defined in

[lib/k8s/serviceAccount.ts:5](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/serviceAccount.ts#L5)
