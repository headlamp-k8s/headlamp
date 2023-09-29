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

[lib/k8s/index.ts:126](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/index.ts#L126)

## Variables

### ResourceClasses

• **ResourceClasses**: `Object` = `resourceClassesDict`

#### Index signature

▪ [className: `string`]: [`KubeObject`](lib_k8s_cluster.md#kubeobject)

#### Defined in

[lib/k8s/index.ts:86](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/index.ts#L86)

## Functions

### getVersion

▸ **getVersion**(`clusterName?`): `Promise`<[`StringDict`](../interfaces/lib_k8s_cluster.StringDict.md)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `clusterName` | `string` | `''` |

#### Returns

`Promise`<[`StringDict`](../interfaces/lib_k8s_cluster.StringDict.md)\>

#### Defined in

[lib/k8s/index.ts:122](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/index.ts#L122)

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

[lib/k8s/index.ts:156](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/index.ts#L156)

___

### matchExpressionSimplifier

▸ **matchExpressionSimplifier**(`matchExpressions`): `string`[] \| ``""``

#### Parameters

| Name | Type |
| :------ | :------ |
| `matchExpressions` | `undefined` \| { `key`: `string` ; `operator`: `string` ; `values`: `string`[]  }[] |

#### Returns

`string`[] \| ``""``

#### Defined in

[lib/k8s/index.ts:191](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/index.ts#L191)

___

### matchLabelsSimplifier

▸ **matchLabelsSimplifier**(`matchLabels`, `isEqualSeperator?`): `string`[] \| ``""``

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `matchLabels` | `undefined` \| { `[key: string]`: `string`;  } | `undefined` |
| `isEqualSeperator` | `boolean` | `false` |

#### Returns

`string`[] \| ``""``

#### Defined in

[lib/k8s/index.ts:171](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/index.ts#L171)

___

### useCluster

▸ **useCluster**(): ``null`` \| `string`

#### Returns

``null`` \| `string`

#### Defined in

[lib/k8s/index.ts:94](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/index.ts#L94)

___

### useClustersConf

▸ **useClustersConf**(): [`ConfigState`](../interfaces/redux_reducers_config.ConfigState.md)[``"clusters"``]

#### Returns

[`ConfigState`](../interfaces/redux_reducers_config.ConfigState.md)[``"clusters"``]

#### Defined in

[lib/k8s/index.ts:89](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/index.ts#L89)

___

### useClustersVersion

▸ **useClustersVersion**(`clusters`): readonly [{ `[cluster: string]`: [`StringDict`](../interfaces/lib_k8s_cluster.StringDict.md);  }, { `[cluster: string]`: [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md) \| ``null``;  }]

Hook to get the version of the clusters given by the parameter.

#### Parameters

| Name | Type |
| :------ | :------ |
| `clusters` | [`Cluster`](../interfaces/lib_k8s_cluster.Cluster.md)[] |

#### Returns

readonly [{ `[cluster: string]`: [`StringDict`](../interfaces/lib_k8s_cluster.StringDict.md);  }, { `[cluster: string]`: [`ApiError`](../interfaces/lib_k8s_apiProxy.ApiError.md) \| ``null``;  }]

a map with cluster -> version-info, and a map with cluster -> error.

#### Defined in

[lib/k8s/index.ts:268](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/index.ts#L268)

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

[lib/k8s/index.ts:128](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/index.ts#L128)
