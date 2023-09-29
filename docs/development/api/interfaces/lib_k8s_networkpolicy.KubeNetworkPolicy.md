---
title: "Interface: KubeNetworkPolicy"
linkTitle: "KubeNetworkPolicy"
slug: "lib_k8s_networkpolicy.KubeNetworkPolicy"
---

[lib/k8s/networkpolicy](../modules/lib_k8s_networkpolicy.md).KubeNetworkPolicy

## Hierarchy

- [`KubeObjectInterface`](lib_k8s_cluster.KubeObjectInterface.md)

  ↳ **`KubeNetworkPolicy`**

## Properties

### apiVersion

• `Optional` **apiVersion**: `string`

#### Inherited from

[KubeObjectInterface](lib_k8s_cluster.KubeObjectInterface.md).[apiVersion](lib_k8s_cluster.KubeObjectInterface.md#apiversion)

#### Defined in

[lib/k8s/cluster.ts:37](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L37)

___

### egress

• **egress**: [`NetworkPolicyEgressRule`](lib_k8s_networkpolicy.NetworkPolicyEgressRule.md)[]

#### Defined in

[lib/k8s/networkpolicy.tsx:32](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/networkpolicy.tsx#L32)

___

### ingress

• **ingress**: [`NetworkPolicyIngressRule`](lib_k8s_networkpolicy.NetworkPolicyIngressRule.md)[]

#### Defined in

[lib/k8s/networkpolicy.tsx:33](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/networkpolicy.tsx#L33)

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

### podSelector

• **podSelector**: [`LabelSelector`](lib_k8s_cluster.LabelSelector.md)

#### Defined in

[lib/k8s/networkpolicy.tsx:34](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/networkpolicy.tsx#L34)

___

### policyTypes

• **policyTypes**: `string`[]

#### Defined in

[lib/k8s/networkpolicy.tsx:35](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/networkpolicy.tsx#L35)
