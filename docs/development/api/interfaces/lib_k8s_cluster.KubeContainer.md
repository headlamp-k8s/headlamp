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

[lib/k8s/cluster.ts:549](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/cluster.ts#L549)

___

### command

• `Optional` **command**: `string`[]

#### Defined in

[lib/k8s/cluster.ts:548](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/cluster.ts#L548)

___

### env

• `Optional` **env**: { `name`: `string` ; `value?`: `string` ; `valueFrom?`: { `configMapKeyRef?`: { `key`: `string` ; `name`: `string`  } ; `fieldRef?`: { `apiVersion`: `string` ; `fieldPath`: `string`  } ; `secretKeyRef?`: { `key`: `string` ; `name`: `string`  }  }  }[]

#### Defined in

[lib/k8s/cluster.ts:565](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/cluster.ts#L565)

___

### envFrom

• `Optional` **envFrom**: { `configMapRef?`: { `name`: `string`  }  }[]

#### Defined in

[lib/k8s/cluster.ts:583](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/cluster.ts#L583)

___

### image

• **image**: `string`

#### Defined in

[lib/k8s/cluster.ts:547](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/cluster.ts#L547)

___

### imagePullPolicy

• **imagePullPolicy**: `string`

#### Defined in

[lib/k8s/cluster.ts:595](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/cluster.ts#L595)

___

### livenessProbe

• `Optional` **livenessProbe**: [`KubeContainerProbe`](lib_k8s_cluster.KubeContainerProbe.md)

#### Defined in

[lib/k8s/cluster.ts:593](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/cluster.ts#L593)

___

### name

• **name**: `string`

#### Defined in

[lib/k8s/cluster.ts:546](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/cluster.ts#L546)

___

### ports

• `Optional` **ports**: { `containerPort`: `number` ; `name?`: `string` ; `protocol`: `string`  }[]

#### Defined in

[lib/k8s/cluster.ts:550](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/cluster.ts#L550)

___

### readinessProbe

• `Optional` **readinessProbe**: [`KubeContainerProbe`](lib_k8s_cluster.KubeContainerProbe.md)

#### Defined in

[lib/k8s/cluster.ts:594](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/cluster.ts#L594)

___

### resources

• `Optional` **resources**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `limits?` | { `cpu?`: `string` ; `memory?`: `string`  } |
| `limits.cpu?` | `string` |
| `limits.memory?` | `string` |
| `requests?` | { `cpu?`: `string` ; `memory?`: `string`  } |
| `requests.cpu?` | `string` |
| `requests.memory?` | `string` |

#### Defined in

[lib/k8s/cluster.ts:555](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/cluster.ts#L555)

___

### volumeMounts

• `Optional` **volumeMounts**: { `mountPath`: `string` ; `name`: `string` ; `readOnly`: `boolean`  }[]

#### Defined in

[lib/k8s/cluster.ts:588](https://github.com/headlamp-k8s/headlamp/blob/a8b3c4c6/frontend/src/lib/k8s/cluster.ts#L588)
