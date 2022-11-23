---
title: "Interface: KubeService"
linkTitle: "KubeService"
slug: "lib_k8s_service.KubeService"
---

[lib/k8s/service](../modules/lib_k8s_service.md).KubeService

## Hierarchy

- [`KubeObjectInterface`](lib_k8s_cluster.KubeObjectInterface.md)

  ↳ **`KubeService`**

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

### spec

• **spec**: `Object`

#### Index signature

▪ [otherProps: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `clusterIP` | `string` |
| `externalIPs` | `string`[] |
| `ports` | { `name`: `string` ; `nodePort`: `number` ; `port`: `number` ; `protocol`: `string` ; `targetPort`: `string` \| `number`  }[] |
| `type` | `string` |

#### Defined in

[lib/k8s/service.ts:18](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/service.ts#L18)

___

### status

• **status**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `conditions?` | [`KubeCondition`](lib_k8s_cluster.KubeCondition.md)[] |
| `loadBalancer?` | { `ingress`: [`KubeLoadBalancerIngress`](lib_k8s_service.KubeLoadBalancerIngress.md)[]  } |
| `loadBalancer.ingress` | [`KubeLoadBalancerIngress`](lib_k8s_service.KubeLoadBalancerIngress.md)[] |

#### Defined in

[lib/k8s/service.ts:31](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/service.ts#L31)
