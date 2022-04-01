---
title: "Interface: KubeContainer"
linkTitle: "KubeContainer"
slug: "lib_k8s_cluster.KubeContainer"
---

[lib/k8s/cluster](../modules/lib_k8s_cluster.md).KubeContainer

## Properties

### args

• `Optional` **args**: `string`[]

#### Defined in

[lib/k8s/cluster.ts:323](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L323)

___

### command

• `Optional` **command**: `string`[]

#### Defined in

[lib/k8s/cluster.ts:322](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L322)

___

### env

• `Optional` **env**: { `name`: `string` ; `value?`: `string` ; `valueFrom?`: { `configMapKeyRef?`: { `key`: `string` ; `name`: `string`  } ; `fieldRef?`: { `apiVersion`: `string` ; `fieldPath`: `string`  } ; `secretKeyRef?`: { `key`: `string` ; `name`: `string`  }  }  }[]

#### Defined in

[lib/k8s/cluster.ts:339](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L339)

___

### envFrom

• `Optional` **envFrom**: { `configMapRef?`: { `name`: `string`  }  }[]

#### Defined in

[lib/k8s/cluster.ts:357](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L357)

___

### image

• **image**: `string`

#### Defined in

[lib/k8s/cluster.ts:321](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L321)

___

### imagePullPolicy

• **imagePullPolicy**: `string`

#### Defined in

[lib/k8s/cluster.ts:369](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L369)

___

### livenessProbe

• `Optional` **livenessProbe**: [`KubeContainerProbe`](lib_k8s_cluster.KubeContainerProbe.md)

#### Defined in

[lib/k8s/cluster.ts:367](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L367)

___

### name

• **name**: `string`

#### Defined in

[lib/k8s/cluster.ts:320](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L320)

___

### ports

• **ports**: { `containerPort`: `number` ; `name?`: `string` ; `protocol`: `string`  }[]

#### Defined in

[lib/k8s/cluster.ts:324](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L324)

___

### readinessProbe

• `Optional` **readinessProbe**: [`KubeContainerProbe`](lib_k8s_cluster.KubeContainerProbe.md)

#### Defined in

[lib/k8s/cluster.ts:368](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L368)

___

### resources

• `Optional` **resources**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `limits` | { `cpu`: `string` ; `memory`: `string`  } |
| `limits.cpu` | `string` |
| `limits.memory` | `string` |
| `requests` | { `cpu`: `string` ; `memory`: `string`  } |
| `requests.cpu` | `string` |
| `requests.memory` | `string` |

#### Defined in

[lib/k8s/cluster.ts:329](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L329)

___

### volumeMounts

• `Optional` **volumeMounts**: { `mountPath`: `string` ; `name`: `string` ; `readOnly`: `boolean`  }[]

#### Defined in

[lib/k8s/cluster.ts:362](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/k8s/cluster.ts#L362)
