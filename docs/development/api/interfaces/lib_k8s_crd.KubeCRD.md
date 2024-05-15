---
title: "Interface: KubeCRD"
linkTitle: "KubeCRD"
slug: "lib_k8s_crd.KubeCRD"
---

[lib/k8s/crd](../modules/lib_k8s_crd.md).KubeCRD

## Hierarchy

- [`KubeObjectInterface`](lib_k8s_cluster.KubeObjectInterface.md)

  ↳ **`KubeCRD`**

## Properties

### apiVersion

• `Optional` **apiVersion**: `string`

#### Inherited from

[KubeObjectInterface](lib_k8s_cluster.KubeObjectInterface.md).[apiVersion](lib_k8s_cluster.KubeObjectInterface.md#apiversion)

#### Defined in

[lib/k8s/cluster.ts:55](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/cluster.ts#L55)

___

### kind

• **kind**: `string`

Kind is a string value representing the REST resource this object represents.
Servers may infer this from the endpoint the client submits requests to.

In CamelCase.

Cannot be updated.

**`see`** [more info](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds)

#### Inherited from

[KubeObjectInterface](lib_k8s_cluster.KubeObjectInterface.md).[kind](lib_k8s_cluster.KubeObjectInterface.md#kind)

#### Defined in

[lib/k8s/cluster.ts:54](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/cluster.ts#L54)

___

### metadata

• **metadata**: [`KubeMetadata`](lib_k8s_cluster.KubeMetadata.md)

#### Inherited from

[KubeObjectInterface](lib_k8s_cluster.KubeObjectInterface.md).[metadata](lib_k8s_cluster.KubeObjectInterface.md#metadata)

#### Defined in

[lib/k8s/cluster.ts:56](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/cluster.ts#L56)

___

### spec

• **spec**: `Object`

#### Index signature

▪ [other: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `group` | `string` |
| `names` | { `kind`: `string` ; `listKind`: `string` ; `plural`: `string` ; `singular`: `string`  } |
| `names.kind` | `string` |
| `names.listKind` | `string` |
| `names.plural` | `string` |
| `names.singular` | `string` |
| `scope` | `string` |
| `version` | `string` |
| `versions` | { `additionalPrinterColumns`: { `description?`: `string` ; `format?`: `string` ; `jsonPath`: `string` ; `name`: `string` ; `priority?`: `number` ; `type`: `string`  }[] ; `name`: `string` ; `served`: `boolean` ; `storage`: `boolean`  }[] |

#### Defined in

[lib/k8s/crd.ts:6](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/crd.ts#L6)
