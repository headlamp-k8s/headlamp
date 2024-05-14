---
title: "Module: lib/k8s/crd"
linkTitle: "lib/k8s/crd"
slug: "lib_k8s_crd"
---

## Classes

- [CustomResourceDefinition](../classes/lib_k8s_crd.CustomResourceDefinition.md)

## Interfaces

- [CRClassArgs](../interfaces/lib_k8s_crd.CRClassArgs.md)
- [KubeCRD](../interfaces/lib_k8s_crd.KubeCRD.md)

## Functions

### makeCustomResourceClass

▸ **makeCustomResourceClass**(`args`, `isNamespaced`): `ReturnType`<typeof [`makeKubeObject`](lib_k8s_cluster.md#makekubeobject)\>

**`deprecated`** Use the version of the function that receives an object as its argument.

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [group: string, version: string, pluralName: string][] |
| `isNamespaced` | `boolean` |

#### Returns

`ReturnType`<typeof [`makeKubeObject`](lib_k8s_cluster.md#makekubeobject)\>

#### Defined in

[lib/k8s/crd.ts:104](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/crd.ts#L104)

▸ **makeCustomResourceClass**(`args`): `ReturnType`<typeof [`makeKubeObject`](lib_k8s_cluster.md#makekubeobject)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`CRClassArgs`](../interfaces/lib_k8s_crd.CRClassArgs.md) |

#### Returns

`ReturnType`<typeof [`makeKubeObject`](lib_k8s_cluster.md#makekubeobject)\>

#### Defined in

[lib/k8s/crd.ts:108](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/crd.ts#L108)
