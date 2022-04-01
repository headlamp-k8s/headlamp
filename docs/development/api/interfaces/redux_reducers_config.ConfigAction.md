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

[redux/reducers/config.tsx:16](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/redux/reducers/config.tsx#L16)

___

### type

• **type**: `string`

#### Inherited from

Action.type

#### Defined in

[redux/actions/actions.tsx:68](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/redux/actions/actions.tsx#L68)
