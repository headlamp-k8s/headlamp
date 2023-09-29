---
title: "Module: redux/reducers/config"
linkTitle: "redux/reducers/config"
slug: "redux_reducers_config"
---

## Interfaces

- [ConfigAction](../interfaces/redux_reducers_config.ConfigAction.md)
- [ConfigState](../interfaces/redux_reducers_config.ConfigState.md)

## Variables

### INITIAL\_STATE

• **INITIAL\_STATE**: [`ConfigState`](../interfaces/redux_reducers_config.ConfigState.md)

#### Defined in

[redux/reducers/config.tsx:24](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/redux/reducers/config.tsx#L24)

___

### defaultTableRowsPerPageOptions

• **defaultTableRowsPerPageOptions**: `number`[]

#### Defined in

[redux/reducers/config.tsx:18](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/redux/reducers/config.tsx#L18)

## Functions

### reducer

▸ **reducer**(`state?`, `action`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`ConfigState`](../interfaces/redux_reducers_config.ConfigState.md) |
| `action` | [`ConfigAction`](../interfaces/redux_reducers_config.ConfigAction.md) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `clusters` | ``null`` \| { `[clusterName: string]`: [`Cluster`](../interfaces/lib_k8s_cluster.Cluster.md);  } |
| `settings` | { `[key: string]`: `any`; `tableRowsPerPageOptions`: `number`[] ; `timezone`: `string`  } |
| `settings.tableRowsPerPageOptions` | `number`[] |
| `settings.timezone` | `string` |

#### Defined in

[redux/reducers/config.tsx:39](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/redux/reducers/config.tsx#L39)
