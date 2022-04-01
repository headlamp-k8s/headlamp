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

[lib/k8s/cluster.ts:393](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L393)

___

### matchLabels

• `Optional` **matchLabels**: `Object`

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

[lib/k8s/cluster.ts:398](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L398)
