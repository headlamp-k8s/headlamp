---
title: "Interface: KubeObjectInterface"
linkTitle: "KubeObjectInterface"
slug: "lib_k8s_cluster.KubeObjectInterface"
---

[lib/k8s/cluster](../modules/lib_k8s_cluster.md).KubeObjectInterface

## Hierarchy

- **`KubeObjectInterface`**

  ↳ [`KubeConfigMap`](lib_k8s_configMap.KubeConfigMap.md)

  ↳ [`KubeCRD`](lib_k8s_crd.KubeCRD.md)

  ↳ [`KubeCronJob`](lib_k8s_cronJob.KubeCronJob.md)

  ↳ [`KubeDaemonSet`](lib_k8s_daemonSet.KubeDaemonSet.md)

  ↳ [`KubeDeployment`](lib_k8s_deployment.KubeDeployment.md)

  ↳ [`KubeEndpoint`](lib_k8s_endpoints.KubeEndpoint.md)

  ↳ [`KubeHPA`](lib_k8s_hpa.KubeHPA.md)

  ↳ [`KubeIngress`](lib_k8s_ingress.KubeIngress.md)

  ↳ [`KubeJob`](lib_k8s_job.KubeJob.md)

  ↳ [`KubeNamespace`](lib_k8s_namespace.KubeNamespace.md)

  ↳ [`KubeNetworkPolicy`](lib_k8s_networkpolicy.KubeNetworkPolicy.md)

  ↳ [`KubeNode`](lib_k8s_node.KubeNode.md)

  ↳ [`KubePersistentVolume`](lib_k8s_persistentVolume.KubePersistentVolume.md)

  ↳ [`KubePersistentVolumeClaim`](lib_k8s_persistentVolumeClaim.KubePersistentVolumeClaim.md)

  ↳ [`KubePod`](lib_k8s_pod.KubePod.md)

  ↳ [`KubePDB`](lib_k8s_podDisruptionBudget.KubePDB.md)

  ↳ [`KubePriorityClasses`](lib_k8s_priorityClasses.KubePriorityClasses.md)

  ↳ [`KubeReplicaSet`](lib_k8s_replicaSet.KubeReplicaSet.md)

  ↳ [`KubeResourceQuota`](lib_k8s_resourceQuota.KubeResourceQuota.md)

  ↳ [`KubeRole`](lib_k8s_role.KubeRole.md)

  ↳ [`KubeRoleBinding`](lib_k8s_roleBinding.KubeRoleBinding.md)

  ↳ [`KubeSecret`](lib_k8s_secret.KubeSecret.md)

  ↳ [`KubeService`](lib_k8s_service.KubeService.md)

  ↳ [`KubeServiceAccount`](lib_k8s_serviceAccount.KubeServiceAccount.md)

  ↳ [`KubeStatefulSet`](lib_k8s_statefulSet.KubeStatefulSet.md)

  ↳ [`KubeStorageClass`](lib_k8s_storageClass.KubeStorageClass.md)

  ↳ [`KubeToken`](lib_k8s_token.KubeToken.md)

## Indexable

▪ [otherProps: `string`]: `any`

## Properties

### apiVersion

• `Optional` **apiVersion**: `string`

#### Defined in

[lib/k8s/cluster.ts:24](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L24)

___

### kind

• **kind**: `string`

#### Defined in

[lib/k8s/cluster.ts:23](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L23)

___

### metadata

• **metadata**: [`KubeMetadata`](lib_k8s_cluster.KubeMetadata.md)

#### Defined in

[lib/k8s/cluster.ts:25](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/cluster.ts#L25)
