---
title: "Interface: ConfigState"
linkTitle: "ConfigState"
slug: "redux_reducers_config.ConfigState"
---

[redux/reducers/config](../modules/redux_reducers_config.md).ConfigState

## Properties

### clusters

• **clusters**: ``null`` \| { `[clusterName: string]`: [`Cluster`](lib_k8s_cluster.Cluster.md);  }

#### Defined in

[redux/reducers/config.tsx:8](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/redux/reducers/config.tsx#L8)

___

### settings

• **settings**: `Object`

#### Index signature

▪ [key: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `tableRowsPerPageOptions` | `number`[] |
| `timezone` | `string` |

#### Defined in

[redux/reducers/config.tsx:11](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/redux/reducers/config.tsx#L11)
