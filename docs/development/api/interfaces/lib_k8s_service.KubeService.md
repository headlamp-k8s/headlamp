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

[lib/k8s/cluster.ts:37](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L37)

___

### kind

• **kind**: `string`

#### Inherited from

[KubeObjectInterface](lib_k8s_cluster.KubeObjectInterface.md).[kind](lib_k8s_cluster.KubeObjectInterface.md#kind)

#### Defined in

[lib/k8s/cluster.ts:36](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L36)

___

### metadata

• **metadata**: [`KubeMetadata`](lib_k8s_cluster.KubeMetadata.md)

#### Inherited from

[KubeObjectInterface](lib_k8s_cluster.KubeObjectInterface.md).[metadata](lib_k8s_cluster.KubeObjectInterface.md#metadata)

#### Defined in

[lib/k8s/cluster.ts:38](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L38)

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
| `selector` | { `[key: string]`: `string`;  } |
| `type` | `string` |

#### Defined in

[lib/k8s/service.ts:18](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/service.ts#L18)

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

[lib/k8s/service.ts:34](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/service.ts#L34)
