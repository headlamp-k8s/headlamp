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

### statelessClusters

When [dynamic clusters](https://github.com/headlamp-k8s/headlamp/blob/main/backend/cmd/server.go#L37) are enabled `statelessClusters` are stored in IndexedDB, providing a client-side caching mechanism for cluster data. This approach reduces server requests, enhancing responsiveness.

• **statelessClusters**: ``null`` \| { `[clusterName: string]`: [`Cluster`](lib_k8s_cluster.Cluster.md);  }

### allClusters

When [dynamic clusters](https://github.com/headlamp-k8s/headlamp/blob/main/backend/cmd/server.go#L37) are disabled, users default to the clusters. When enabled, `allClusters` represent the combined set of clusters and statelessClusters, providing a unified view.

• **allClusters**: ``null`` \| { `[clusterName: string]`: [`Cluster`](lib_k8s_cluster.Cluster.md);  }

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
