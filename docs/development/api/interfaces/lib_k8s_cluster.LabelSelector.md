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

[lib/k8s/cluster.ts:476](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L476)

___

### matchLabels

• `Optional` **matchLabels**: `Object`

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

[lib/k8s/cluster.ts:481](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L481)
