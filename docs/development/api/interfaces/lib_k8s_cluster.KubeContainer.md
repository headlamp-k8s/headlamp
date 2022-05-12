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

[lib/k8s/cluster.ts:384](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L384)

___

### command

• `Optional` **command**: `string`[]

#### Defined in

[lib/k8s/cluster.ts:383](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L383)

___

### env

• `Optional` **env**: { `name`: `string` ; `value?`: `string` ; `valueFrom?`: { `configMapKeyRef?`: { `key`: `string` ; `name`: `string`  } ; `fieldRef?`: { `apiVersion`: `string` ; `fieldPath`: `string`  } ; `secretKeyRef?`: { `key`: `string` ; `name`: `string`  }  }  }[]

#### Defined in

[lib/k8s/cluster.ts:400](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L400)

___

### envFrom

• `Optional` **envFrom**: { `configMapRef?`: { `name`: `string`  }  }[]

#### Defined in

[lib/k8s/cluster.ts:418](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L418)

___

### image

• **image**: `string`

#### Defined in

[lib/k8s/cluster.ts:382](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L382)

___

### imagePullPolicy

• **imagePullPolicy**: `string`

#### Defined in

[lib/k8s/cluster.ts:430](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L430)

___

### livenessProbe

• `Optional` **livenessProbe**: [`KubeContainerProbe`](lib_k8s_cluster.KubeContainerProbe.md)

#### Defined in

[lib/k8s/cluster.ts:428](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L428)

___

### name

• **name**: `string`

#### Defined in

[lib/k8s/cluster.ts:381](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L381)

___

### ports

• **ports**: { `containerPort`: `number` ; `name?`: `string` ; `protocol`: `string`  }[]

#### Defined in

[lib/k8s/cluster.ts:385](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L385)

___

### readinessProbe

• `Optional` **readinessProbe**: [`KubeContainerProbe`](lib_k8s_cluster.KubeContainerProbe.md)

#### Defined in

[lib/k8s/cluster.ts:429](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L429)

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

[lib/k8s/cluster.ts:390](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L390)

___

### volumeMounts

• `Optional` **volumeMounts**: { `mountPath`: `string` ; `name`: `string` ; `readOnly`: `boolean`  }[]

#### Defined in

[lib/k8s/cluster.ts:423](https://github.com/kinvolk/headlamp/blob/2fb68817/frontend/src/lib/k8s/cluster.ts#L423)
