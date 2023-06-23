---
title: "Interface: ConfigAction"
linkTitle: "ConfigAction"
slug: "redux_reducers_config.ConfigAction"
---

[redux/reducers/config](../modules/redux_reducers_config.md).ConfigAction

## Hierarchy

- `Action`

  ↳ **`ConfigAction`**

## Properties

### config

• **config**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `clusters` | ``null`` \| { `[clusterName: string]`: [`Cluster`](lib_k8s_cluster.Cluster.md);  } |

#### Defined in

[redux/reducers/config.tsx:34](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/redux/reducers/config.tsx#L34)

___

### type

• **type**: `string`

#### Inherited from

Action.type

#### Defined in

[redux/actions/actions.tsx:81](https://github.com/headlamp-k8s/headlamp/blob/1093c364/frontend/src/redux/actions/actions.tsx#L81)
