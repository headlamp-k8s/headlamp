---
title: "Module: lib/router"
linkTitle: "lib/router"
slug: "lib_router"
---

## Interfaces

- [Route](../interfaces/lib_router.Route.md)
- [RouteURLProps](../interfaces/lib_router.RouteURLProps.md)

## Variables

### NotFoundRoute

• **NotFoundRoute**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `component` | () => `Element` |
| `exact` | `boolean` |
| `name` | `string` |
| `noAuthRequired` | `boolean` |
| `path` | `string` |
| `sidebar` | ``null`` |

#### Defined in

[lib/router.tsx:710](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/router.tsx#L710)

## Functions

### createRouteURL

▸ **createRouteURL**(`routeName`, `params?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `routeName` | `string` |
| `params` | [`RouteURLProps`](../interfaces/lib_router.RouteURLProps.md) |

#### Returns

`string`

#### Defined in

[lib/router.tsx:768](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/router.tsx#L768)

___

### getDefaultRoutes

▸ **getDefaultRoutes**(): `Object`

#### Returns

`Object`

#### Defined in

[lib/router.tsx:796](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/router.tsx#L796)

___

### getRoute

▸ **getRoute**(`routeName`): [`Route`](../interfaces/lib_router.Route.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `routeName` | `string` |

#### Returns

[`Route`](../interfaces/lib_router.Route.md)

#### Defined in

[lib/router.tsx:719](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/router.tsx#L719)

___

### getRoutePath

▸ **getRoutePath**(`route`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `route` | [`Route`](../interfaces/lib_router.Route.md) |

#### Returns

`string`

#### Defined in

[lib/router.tsx:752](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/router.tsx#L752)

___

### getRouteUseClusterURL

▸ **getRouteUseClusterURL**(`route`): `boolean`

Should the route use a cluster URL?

#### Parameters

| Name | Type |
| :------ | :------ |
| `route` | [`Route`](../interfaces/lib_router.Route.md) |

#### Returns

`boolean`

true when a cluster URL contains cluster in the URL. eg. /c/minikube/my-url
  false, the URL does not contain the cluster. eg. /my-url

#### Defined in

[lib/router.tsx:740](https://github.com/headlamp-k8s/headlamp/blob/840d05a1/frontend/src/lib/router.tsx#L740)
