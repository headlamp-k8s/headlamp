---
title: "Module: lib/k8s"
linkTitle: "lib/k8s"
slug: "lib_k8s"
---

## References

### cluster

Renames and re-exports [lib/k8s/cluster](lib_k8s_cluster.md)

___

### clusterRole

Renames and re-exports [lib/k8s/clusterRole](lib_k8s_clusterRole.md)

___

### clusterRoleBinding

Renames and re-exports [lib/k8s/clusterRoleBinding](lib_k8s_clusterRoleBinding.md)

___

### configMap

Renames and re-exports [lib/k8s/configMap](lib_k8s_configMap.md)

___

### crd

Renames and re-exports [lib/k8s/crd](lib_k8s_crd.md)

___

### cronJob

Renames and re-exports [lib/k8s/cronJob](lib_k8s_cronJob.md)

___

### daemonSet

Renames and re-exports [lib/k8s/daemonSet](lib_k8s_daemonSet.md)

___

### deployment

Renames and re-exports [lib/k8s/deployment](lib_k8s_deployment.md)

___

### event

Renames and re-exports [lib/k8s/event](lib_k8s_event.md)

___

### ingress

Renames and re-exports [lib/k8s/ingress](lib_k8s_ingress.md)

___

### job

Renames and re-exports [lib/k8s/job](lib_k8s_job.md)

___

### namespace

Renames and re-exports [lib/k8s/namespace](lib_k8s_namespace.md)

___

### node

Renames and re-exports [lib/k8s/node](lib_k8s_node.md)

___

### persistentVolume

Renames and re-exports [lib/k8s/persistentVolume](lib_k8s_persistentVolume.md)

___

### persistentVolumeClaim

Renames and re-exports [lib/k8s/persistentVolumeClaim](lib_k8s_persistentVolumeClaim.md)

___

### pod

Renames and re-exports [lib/k8s/pod](lib_k8s_pod.md)

___

### replicaSet

Renames and re-exports [lib/k8s/replicaSet](lib_k8s_replicaSet.md)

___

### role

Renames and re-exports [lib/k8s/role](lib_k8s_role.md)

___

### roleBinding

Renames and re-exports [lib/k8s/roleBinding](lib_k8s_roleBinding.md)

___

### secret

Renames and re-exports [lib/k8s/secret](lib_k8s_secret.md)

___

### service

Renames and re-exports [lib/k8s/service](lib_k8s_service.md)

___

### serviceAccount

Renames and re-exports [lib/k8s/serviceAccount](lib_k8s_serviceAccount.md)

___

### statefulSet

Renames and re-exports [lib/k8s/statefulSet](lib_k8s_statefulSet.md)

___

### storageClass

Renames and re-exports [lib/k8s/storageClass](lib_k8s_storageClass.md)

## Type aliases

### CancellablePromise

Ƭ **CancellablePromise**: `Promise`<() => `void`\>

#### Defined in

[lib/k8s/index.ts:159](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/index.ts#L159)

## Variables

### ResourceClasses

• `Const` **ResourceClasses**: `Object` = `resourceClassesDict`

#### Index signature

▪ [className: `string`]: [`KubeObject`](lib_k8s_cluster.md#kubeobject)

#### Defined in

[lib/k8s/index.ts:83](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/index.ts#L83)

## Functions

### getVersion

▸ **getVersion**(): `Promise`<[`StringDict`](../interfaces/lib_k8s_cluster.StringDict.md)\>

#### Returns

`Promise`<[`StringDict`](../interfaces/lib_k8s_cluster.StringDict.md)\>

#### Defined in

[lib/k8s/index.ts:155](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/index.ts#L155)

___

### labelSelectorToQuery

▸ **labelSelectorToQuery**(`labelSelector`): `string`

See [Label selector examples](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#list-and-watch-filtering),
[deployment selector example](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#resources-that-support-set-based-requirements),
[possible operators](https://github.com/kubernetes/apimachinery/blob/be3a79b26814a8d7637d70f4d434a4626ee1c1e7/pkg/selection/operator.go#L24), and
[Format rule for expressions](https://github.com/kubernetes/apimachinery/blob/be3a79b26814a8d7637d70f4d434a4626ee1c1e7/pkg/labels/selector.go#L305).

#### Parameters

| Name | Type |
| :------ | :------ |
| `labelSelector` | [`LabelSelector`](../interfaces/lib_k8s_cluster.LabelSelector.md) |

#### Returns

`string`

#### Defined in

[lib/k8s/index.ts:190](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/index.ts#L190)

___

### useCluster

▸ **useCluster**(): ``null`` \| `string`

#### Returns

``null`` \| `string`

#### Defined in

[lib/k8s/index.ts:138](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/index.ts#L138)

___

### useClustersConf

▸ **useClustersConf**(): [`ConfigState`](../interfaces/redux_reducers_config.ConfigState.md)[``"clusters"``]

#### Returns

[`ConfigState`](../interfaces/redux_reducers_config.ConfigState.md)[``"clusters"``]

#### Defined in

[lib/k8s/index.ts:90](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/index.ts#L90)

___

### useConnectApi

▸ **useConnectApi**(...`apiCalls`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...apiCalls` | () => [`CancellablePromise`](lib_k8s.md#cancellablepromise)[] |

#### Returns

`void`

#### Defined in

[lib/k8s/index.ts:161](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/index.ts#L161)
