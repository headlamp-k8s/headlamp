---
title: "Interface: KubeCronJob"
linkTitle: "KubeCronJob"
slug: "lib_k8s_cronJob.KubeCronJob"
---

[lib/k8s/cronJob](../modules/lib_k8s_cronJob.md).KubeCronJob

CronJob structure returned by the k8s API.

**`see`** [https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/cron-job-v1/](https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/cron-job-v1/) Kubernetes API reference for CronJob

**`see`** [https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/) Kubernetes definition for CronJob

## Hierarchy

- [`KubeObjectInterface`](lib_k8s_cluster.KubeObjectInterface.md)

  ↳ **`KubeCronJob`**

## Properties

### apiVersion

• `Optional` **apiVersion**: `string`

#### Inherited from

[KubeObjectInterface](lib_k8s_cluster.KubeObjectInterface.md).[apiVersion](lib_k8s_cluster.KubeObjectInterface.md#apiversion)

#### Defined in

[lib/k8s/cluster.ts:37](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L37)

___

### kind

• **kind**: `string`

#### Inherited from

[KubeObjectInterface](lib_k8s_cluster.KubeObjectInterface.md).[kind](lib_k8s_cluster.KubeObjectInterface.md#kind)

#### Defined in

[lib/k8s/cluster.ts:36](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L36)

___

### metadata

• **metadata**: [`KubeMetadata`](lib_k8s_cluster.KubeMetadata.md)

#### Inherited from

[KubeObjectInterface](lib_k8s_cluster.KubeObjectInterface.md).[metadata](lib_k8s_cluster.KubeObjectInterface.md#metadata)

#### Defined in

[lib/k8s/cluster.ts:38](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cluster.ts#L38)

___

### spec

• **spec**: `Object`

#### Index signature

▪ [otherProps: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `concurrencyPolicy` | `string` |
| `failedJobsHistoryLimit` | `number` |
| `jobTemplate` | { `spec`: { `metadata?`: `Partial`<[`KubeMetadata`](lib_k8s_cluster.KubeMetadata.md)\> ; `template`: { `spec`: { `containers`: [`KubeContainer`](lib_k8s_cluster.KubeContainer.md)[] ; `metadata?`: `Partial`<[`KubeMetadata`](lib_k8s_cluster.KubeMetadata.md)\>  }  }  }  } |
| `jobTemplate.spec` | { `metadata?`: `Partial`<[`KubeMetadata`](lib_k8s_cluster.KubeMetadata.md)\> ; `template`: { `spec`: { `containers`: [`KubeContainer`](lib_k8s_cluster.KubeContainer.md)[] ; `metadata?`: `Partial`<[`KubeMetadata`](lib_k8s_cluster.KubeMetadata.md)\>  }  }  } |
| `jobTemplate.spec.metadata?` | `Partial`<[`KubeMetadata`](lib_k8s_cluster.KubeMetadata.md)\> |
| `jobTemplate.spec.template` | { `spec`: { `containers`: [`KubeContainer`](lib_k8s_cluster.KubeContainer.md)[] ; `metadata?`: `Partial`<[`KubeMetadata`](lib_k8s_cluster.KubeMetadata.md)\>  }  } |
| `jobTemplate.spec.template.spec` | { `containers`: [`KubeContainer`](lib_k8s_cluster.KubeContainer.md)[] ; `metadata?`: `Partial`<[`KubeMetadata`](lib_k8s_cluster.KubeMetadata.md)\>  } |
| `jobTemplate.spec.template.spec.containers` | [`KubeContainer`](lib_k8s_cluster.KubeContainer.md)[] |
| `jobTemplate.spec.template.spec.metadata?` | `Partial`<[`KubeMetadata`](lib_k8s_cluster.KubeMetadata.md)\> |
| `schedule` | `string` |
| `startingDeadlineSeconds?` | `number` |
| `successfulJobsHistoryLimit` | `number` |
| `suspend` | `boolean` |

#### Defined in

[lib/k8s/cronJob.ts:12](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cronJob.ts#L12)

___

### status

• **status**: `Object`

#### Index signature

▪ [otherProps: `string`]: `any`

#### Defined in

[lib/k8s/cronJob.ts:32](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/cronJob.ts#L32)
