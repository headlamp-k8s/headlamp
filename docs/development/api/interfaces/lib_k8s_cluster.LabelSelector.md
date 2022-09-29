---
title: "Interface: LabelSelector"
linkTitle: "LabelSelector"
slug: "lib_k8s_cluster.LabelSelector"
---

[lib/k8s/cluster](../modules/lib_k8s_cluster.md).LabelSelector

## Properties

### matchExpressions

• `Optional` **matchExpressions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `operator` | `string` |
| `values` | `string`[] |

#### Defined in

[lib/k8s/cluster.ts:495](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L495)

___

### matchLabels

• `Optional` **matchLabels**: `Object`

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

[lib/k8s/cluster.ts:500](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L500)
