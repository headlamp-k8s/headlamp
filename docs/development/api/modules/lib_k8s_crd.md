---
title: "Module: lib/k8s/crd"
linkTitle: "lib/k8s/crd"
slug: "lib_k8s_crd"
---

## Classes

- [default](../classes/lib_k8s_crd.default.md)

## Interfaces

- [KubeCRD](../interfaces/lib_k8s_crd.KubeCRD.md)

## Functions

### makeCustomResourceClass

▸ **makeCustomResourceClass**(`args`, `isNamespaced`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [group: string, version: string, pluralName: string][] |
| `isNamespaced` | `boolean` |

#### Returns

`any`

#### Defined in

[lib/k8s/crd.ts:57](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/crd.ts#L57)
