---
title: "Interface: KubeOwnerReference"
linkTitle: "KubeOwnerReference"
slug: "lib_k8s_cluster.KubeOwnerReference"
---

[lib/k8s/cluster](../modules/lib_k8s_cluster.md).KubeOwnerReference

## Properties

### apiVersion

• **apiVersion**: `string`

API version of the referent.

#### Defined in

[lib/k8s/cluster.ts:198](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/cluster.ts#L198)

___

### blockOwnerDeletion

• **blockOwnerDeletion**: `boolean`

If true, AND if the owner has the "foregroundDeletion" finalizer, then the owner cannot
be deleted from the key-value store until this reference is removed.

**`see`** [foreground deletion](https://kubernetes.io/docs/concepts/architecture/garbage-collection/#foreground-deletion)
for how the garbage collector interacts with this field and enforces the foreground deletion.

Defaults to false. To set this field, a user needs "delete" permission of the owner,
otherwise 422 (Unprocessable Entity) will be returned.

#### Defined in

[lib/k8s/cluster.ts:210](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/cluster.ts#L210)

___

### controller

• **controller**: `boolean`

If true, this reference points to the managing controller.

#### Defined in

[lib/k8s/cluster.ts:212](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/cluster.ts#L212)

___

### kind

• **kind**: `string`

Kind of the referent.

#### Defined in

[lib/k8s/cluster.ts:214](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/cluster.ts#L214)

___

### name

• **name**: `string`

Name of the referent.

#### Defined in

[lib/k8s/cluster.ts:216](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/cluster.ts#L216)

___

### uid

• **uid**: `string`

UID of the referent.

#### Defined in

[lib/k8s/cluster.ts:218](https://github.com/headlamp-k8s/headlamp/blob/45b84205/frontend/src/lib/k8s/cluster.ts#L218)
