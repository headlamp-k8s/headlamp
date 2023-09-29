---
title: "Interface: KubeIngress"
linkTitle: "KubeIngress"
slug: "lib_k8s_ingress.KubeIngress"
---

[lib/k8s/ingress](../modules/lib_k8s_ingress.md).KubeIngress

## Hierarchy

- [`KubeObjectInterface`](lib_k8s_cluster.KubeObjectInterface.md)

  ↳ **`KubeIngress`**

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

▪ [key: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `defaultBackend?` | { `resource?`: { `apiVersion`: `string` ; `kind`: `string` ; `name`: `string`  } ; `service?`: { `name`: `string` ; `port`: { `name?`: `string` ; `number?`: `number`  }  }  } |
| `defaultBackend.resource?` | { `apiVersion`: `string` ; `kind`: `string` ; `name`: `string`  } |
| `defaultBackend.resource.apiVersion` | `string` |
| `defaultBackend.resource.kind` | `string` |
| `defaultBackend.resource.name` | `string` |
| `defaultBackend.service?` | { `name`: `string` ; `port`: { `name?`: `string` ; `number?`: `number`  }  } |
| `defaultBackend.service.name` | `string` |
| `defaultBackend.service.port` | { `name?`: `string` ; `number?`: `number`  } |
| `defaultBackend.service.port.name?` | `string` |
| `defaultBackend.service.port.number?` | `number` |
| `ingressClassName?` | `string` |
| `rules` | [`IngressRule`](lib_k8s_ingress.IngressRule.md)[] \| `LegacyIngressRule`[] |
| `tls?` | { `hosts`: `string`[] ; `secretName`: `string`  }[] |

#### Defined in

[lib/k8s/ingress.ts:46](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/ingress.ts#L46)
