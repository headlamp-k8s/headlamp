---
title: "Interface: IngressBackend"
linkTitle: "IngressBackend"
slug: "lib_k8s_ingress.IngressBackend"
---

[lib/k8s/ingress](../modules/lib_k8s_ingress.md).IngressBackend

## Properties

### resource

• `Optional` **resource**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `apiVersion` | `string` |
| `kind` | `string` |
| `name` | `string` |

#### Defined in

[lib/k8s/ingress.ts:38](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/ingress.ts#L38)

___

### service

• `Optional` **service**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `port` | { `name?`: `string` ; `number?`: `number`  } |
| `port.name?` | `string` |
| `port.number?` | `number` |

#### Defined in

[lib/k8s/ingress.ts:31](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/ingress.ts#L31)
