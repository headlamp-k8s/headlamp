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

[lib/k8s/cluster.ts:425](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L425)

___

### command

• `Optional` **command**: `string`[]

#### Defined in

[lib/k8s/cluster.ts:424](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L424)

___

### env

• `Optional` **env**: { `name`: `string` ; `value?`: `string` ; `valueFrom?`: { `configMapKeyRef?`: { `key`: `string` ; `name`: `string`  } ; `fieldRef?`: { `apiVersion`: `string` ; `fieldPath`: `string`  } ; `secretKeyRef?`: { `key`: `string` ; `name`: `string`  }  }  }[]

#### Defined in

[lib/k8s/cluster.ts:441](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L441)

___

### envFrom

• `Optional` **envFrom**: { `configMapRef?`: { `name`: `string`  }  }[]

#### Defined in

[lib/k8s/cluster.ts:459](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L459)

___

### image

• **image**: `string`

#### Defined in

[lib/k8s/cluster.ts:423](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L423)

___

### imagePullPolicy

• **imagePullPolicy**: `string`

#### Defined in

[lib/k8s/cluster.ts:471](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L471)

___

### livenessProbe

• `Optional` **livenessProbe**: [`KubeContainerProbe`](lib_k8s_cluster.KubeContainerProbe.md)

#### Defined in

[lib/k8s/cluster.ts:469](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L469)

___

### name

• **name**: `string`

#### Defined in

[lib/k8s/cluster.ts:422](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L422)

___

### ports

• **ports**: { `containerPort`: `number` ; `name?`: `string` ; `protocol`: `string`  }[]

#### Defined in

[lib/k8s/cluster.ts:426](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L426)

___

### readinessProbe

• `Optional` **readinessProbe**: [`KubeContainerProbe`](lib_k8s_cluster.KubeContainerProbe.md)

#### Defined in

[lib/k8s/cluster.ts:470](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L470)

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

[lib/k8s/cluster.ts:431](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L431)

___

### volumeMounts

• `Optional` **volumeMounts**: { `mountPath`: `string` ; `name`: `string` ; `readOnly`: `boolean`  }[]

#### Defined in

[lib/k8s/cluster.ts:464](https://github.com/kinvolk/headlamp/blob/ba073244/frontend/src/lib/k8s/cluster.ts#L464)
