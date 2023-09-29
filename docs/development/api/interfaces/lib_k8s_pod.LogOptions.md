---
title: "Interface: LogOptions"
linkTitle: "LogOptions"
slug: "lib_k8s_pod.LogOptions"
---

[lib/k8s/pod](../modules/lib_k8s_pod.md).LogOptions

## Properties

### follow

• `Optional` **follow**: `boolean`

Whether to follow the log stream

#### Defined in

[lib/k8s/pod.ts:52](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/pod.ts#L52)

___

### showPrevious

• `Optional` **showPrevious**: `boolean`

Whether to show the logs from previous runs of the container (only for restarted containers)

#### Defined in

[lib/k8s/pod.ts:48](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/pod.ts#L48)

___

### showTimestamps

• `Optional` **showTimestamps**: `boolean`

Whether to show the timestamps in the logs

#### Defined in

[lib/k8s/pod.ts:50](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/pod.ts#L50)

___

### tailLines

• `Optional` **tailLines**: `number`

The number of lines to display from the end side of the log

#### Defined in

[lib/k8s/pod.ts:46](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/k8s/pod.ts#L46)
