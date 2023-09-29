---
title: "Module: lib/k8s/crd"
linkTitle: "lib/k8s/crd"
slug: "lib_k8s_crd"
---

## Classes

- [CustomResourceDefinition](../classes/lib_k8s_crd.CustomResourceDefinition.md)

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

[lib/k8s/crd.ts:80](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/crd.ts#L80)
