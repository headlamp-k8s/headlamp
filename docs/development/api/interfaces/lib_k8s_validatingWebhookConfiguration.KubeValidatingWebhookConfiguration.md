---
title: "Interface: KubeValidatingWebhookConfiguration"
linkTitle: "KubeValidatingWebhookConfiguration"
slug: "lib_k8s_validatingWebhookConfiguration.KubeValidatingWebhookConfiguration"
---

[lib/k8s/validatingWebhookConfiguration](../modules/lib_k8s_validatingWebhookConfiguration.md).KubeValidatingWebhookConfiguration

## Hierarchy

- [`KubeObjectInterface`](lib_k8s_cluster.KubeObjectInterface.md)

  ↳ **`KubeValidatingWebhookConfiguration`**

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

### webhooks

• **webhooks**: { `admissionReviewVersions`: `string`[] ; `clientConfig`: [`KubeWebhookClientConfig`](lib_k8s_mutatingWebhookConfiguration.KubeWebhookClientConfig.md) ; `failurePolicy?`: `string` ; `matchPolicy?`: `string` ; `name`: `string` ; `namespaceSelector?`: { `matchExpressions`: `undefined` \| { `key`: `string` ; `operator`: `string` ; `values`: `string`[]  }[] ; `matchLabels`: `undefined` \| { `[key: string]`: `string`;  }  } ; `objectSelector?`: { `matchExpressions`: `undefined` \| { `key`: `string` ; `operator`: `string` ; `values`: `string`[]  }[] ; `matchLabels`: `undefined` \| { `[key: string]`: `string`;  }  } ; `rules?`: [`KubeRuleWithOperations`](lib_k8s_mutatingWebhookConfiguration.KubeRuleWithOperations.md)[] ; `sideEffects?`: `string` ; `timeoutSeconds?`: `number`  }[]

#### Defined in

[lib/k8s/validatingWebhookConfiguration.ts:6](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/validatingWebhookConfiguration.ts#L6)
