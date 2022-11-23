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

[lib/k8s/pod.ts:47](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/pod.ts#L47)

___

### showPrevious

• `Optional` **showPrevious**: `boolean`

Whether to show the logs from previous runs of the container (only for restarted containers)

#### Defined in

[lib/k8s/pod.ts:43](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/pod.ts#L43)

___

### showTimestamps

• `Optional` **showTimestamps**: `boolean`

Whether to show the timestamps in the logs

#### Defined in

[lib/k8s/pod.ts:45](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/pod.ts#L45)

___

### tailLines

• `Optional` **tailLines**: `number`

The number of lines to display from the end side of the log

#### Defined in

[lib/k8s/pod.ts:41](https://github.com/kinvolk/headlamp/blob/16fcc2a7/frontend/src/lib/k8s/pod.ts#L41)
