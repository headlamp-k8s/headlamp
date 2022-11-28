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

[lib/k8s/cluster.ts:24](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L24)

___

### egress

• **egress**: `NetworkPolicyEgressRule`[]

#### Defined in

[lib/k8s/networkpolicy.tsx:32](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/networkpolicy.tsx#L32)

___

### ingress

• **ingress**: `NetworkPolicyIngressRule`[]

#### Defined in

[lib/k8s/networkpolicy.tsx:33](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/networkpolicy.tsx#L33)

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

### podSelector

• **podSelector**: [`LabelSelector`](lib_k8s_cluster.LabelSelector.md)

#### Defined in

[lib/k8s/networkpolicy.tsx:34](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/networkpolicy.tsx#L34)

___

### policyTypes

• **policyTypes**: `string`[]

#### Defined in

[lib/k8s/networkpolicy.tsx:35](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/networkpolicy.tsx#L35)
