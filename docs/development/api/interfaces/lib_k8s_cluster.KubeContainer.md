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

[lib/k8s/cluster.ts:406](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L406)

___

### command

• `Optional` **command**: `string`[]

#### Defined in

[lib/k8s/cluster.ts:405](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L405)

___

### env

• `Optional` **env**: { `name`: `string` ; `value?`: `string` ; `valueFrom?`: { `configMapKeyRef?`: { `key`: `string` ; `name`: `string`  } ; `fieldRef?`: { `apiVersion`: `string` ; `fieldPath`: `string`  } ; `secretKeyRef?`: { `key`: `string` ; `name`: `string`  }  }  }[]

#### Defined in

[lib/k8s/cluster.ts:422](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L422)

___

### envFrom

• `Optional` **envFrom**: { `configMapRef?`: { `name`: `string`  }  }[]

#### Defined in

[lib/k8s/cluster.ts:440](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L440)

___

### image

• **image**: `string`

#### Defined in

[lib/k8s/cluster.ts:404](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L404)

___

### imagePullPolicy

• **imagePullPolicy**: `string`

#### Defined in

[lib/k8s/cluster.ts:452](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L452)

___

### livenessProbe

• `Optional` **livenessProbe**: [`KubeContainerProbe`](lib_k8s_cluster.KubeContainerProbe.md)

#### Defined in

[lib/k8s/cluster.ts:450](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L450)

___

### name

• **name**: `string`

#### Defined in

[lib/k8s/cluster.ts:403](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L403)

___

### ports

• **ports**: { `containerPort`: `number` ; `name?`: `string` ; `protocol`: `string`  }[]

#### Defined in

[lib/k8s/cluster.ts:407](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L407)

___

### readinessProbe

• `Optional` **readinessProbe**: [`KubeContainerProbe`](lib_k8s_cluster.KubeContainerProbe.md)

#### Defined in

[lib/k8s/cluster.ts:451](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L451)

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

[lib/k8s/cluster.ts:412](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L412)

___

### volumeMounts

• `Optional` **volumeMounts**: { `mountPath`: `string` ; `name`: `string` ; `readOnly`: `boolean`  }[]

#### Defined in

[lib/k8s/cluster.ts:445](https://github.com/kinvolk/headlamp/blob/f70c8787/frontend/src/lib/k8s/cluster.ts#L445)
