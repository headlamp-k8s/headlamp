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
| `noAuthRequired` | `boolean` |
| `path` | `string` |
| `sidebar` | ``null`` |

#### Defined in

[lib/router.tsx:430](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/router.tsx#L430)

___

### ROUTES

• **ROUTES**: `Object`

#### Index signature

▪ [routeName: `string`]: [`Route`](../interfaces/lib_router.Route.md)

#### Defined in

[lib/router.tsx:76](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/router.tsx#L76)

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

[lib/router.tsx:458](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/router.tsx#L458)

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

[lib/router.tsx:438](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/router.tsx#L438)

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

[lib/router.tsx:442](https://github.com/kinvolk/headlamp/blob/168f394/frontend/src/lib/router.tsx#L442)
