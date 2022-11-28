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

• `Const` **INITIAL\_STATE**: [`ConfigState`](../interfaces/redux_reducers_config.ConfigState.md)

#### Defined in

[redux/reducers/config.tsx:11](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/redux/reducers/config.tsx#L11)

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

#### Defined in

[redux/reducers/config.tsx:21](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/redux/reducers/config.tsx#L21)
