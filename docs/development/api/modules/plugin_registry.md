---
title: "Module: plugin/registry"
linkTitle: "plugin/registry"
slug: "plugin_registry"
---

## Classes

- [default](../classes/plugin_registry.default.md)

## Interfaces

- [SectionFuncProps](../interfaces/plugin_registry.SectionFuncProps.md)

## Type aliases

### sectionFunc

Ƭ **sectionFunc**: (`resource`: [`KubeObject`](lib_k8s_cluster.md#kubeobject)) => [`SectionFuncProps`](../interfaces/plugin_registry.SectionFuncProps.md) \| ``null`` \| `undefined`

#### Type declaration

▸ (`resource`): [`SectionFuncProps`](../interfaces/plugin_registry.SectionFuncProps.md) \| ``null`` \| `undefined`

##### Parameters

| Name | Type |
| :------ | :------ |
| `resource` | [`KubeObject`](lib_k8s_cluster.md#kubeobject) |

##### Returns

[`SectionFuncProps`](../interfaces/plugin_registry.SectionFuncProps.md) \| ``null`` \| `undefined`

#### Defined in

[plugin/registry.tsx:19](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/plugin/registry.tsx#L19)
