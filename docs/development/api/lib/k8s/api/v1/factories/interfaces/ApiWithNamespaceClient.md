# Interface: ApiWithNamespaceClient\<ResourceType\>

## Type Parameters

| Type Parameter |
| ------ |
| `ResourceType` *extends* [`KubeObjectInterface`](../../../../KubeObject/interfaces/KubeObjectInterface.md) |

## Properties

### apiInfo

```ts
apiInfo: object[];
```

#### group

```ts
group: string;
```

#### resource

```ts
resource: string;
```

#### version

```ts
version: string;
```

#### Defined in

[frontend/src/lib/k8s/api/v1/factories.ts:122](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/factories.ts#L122)

***

### delete()

```ts
delete: (namespace: string, name: string, queryParams?: QueryParameters, cluster?: string) => Promise<any>;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |
| `name` | `string` |
| `queryParams`? | [`QueryParameters`](../../queryParameters/interfaces/QueryParameters.md) |
| `cluster`? | `string` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[frontend/src/lib/k8s/api/v1/factories.ts:115](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/factories.ts#L115)

***

### get()

```ts
get: (namespace: string, name: string, cb: StreamResultsCb<ResourceType>, errCb: StreamErrCb, queryParams?: QueryParameters, cluster?: string) => Promise<CancelFunction>;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |
| `name` | `string` |
| `cb` | [`StreamResultsCb`](../../streamingApi/type-aliases/StreamResultsCb.md)\<`ResourceType`\> |
| `errCb` | [`StreamErrCb`](../../streamingApi/type-aliases/StreamErrCb.md) |
| `queryParams`? | [`QueryParameters`](../../queryParameters/interfaces/QueryParameters.md) |
| `cluster`? | `string` |

#### Returns

`Promise`\<[`CancelFunction`](../type-aliases/CancelFunction.md)\>

#### Defined in

[frontend/src/lib/k8s/api/v1/factories.ts:90](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/factories.ts#L90)

***

### isNamespaced

```ts
isNamespaced: boolean;
```

#### Defined in

[frontend/src/lib/k8s/api/v1/factories.ts:121](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/factories.ts#L121)

***

### list()

```ts
list: (namespace: string, cb: StreamResultsCb<ResourceType>, errCb: StreamErrCb, queryParams?: QueryParameters, cluster?: string) => Promise<CancelFunction>;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |
| `cb` | [`StreamResultsCb`](../../streamingApi/type-aliases/StreamResultsCb.md)\<`ResourceType`\> |
| `errCb` | [`StreamErrCb`](../../streamingApi/type-aliases/StreamErrCb.md) |
| `queryParams`? | [`QueryParameters`](../../queryParameters/interfaces/QueryParameters.md) |
| `cluster`? | `string` |

#### Returns

`Promise`\<[`CancelFunction`](../type-aliases/CancelFunction.md)\>

#### Defined in

[frontend/src/lib/k8s/api/v1/factories.ts:83](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/factories.ts#L83)

***

### patch()

```ts
patch: (body: OpPatch[], namespace: string, name: string, queryParams?: QueryParameters, cluster?: string) => Promise<any>;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `body` | `OpPatch`[] |
| `namespace` | `string` |
| `name` | `string` |
| `queryParams`? | [`QueryParameters`](../../queryParameters/interfaces/QueryParameters.md) |
| `cluster`? | `string` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[frontend/src/lib/k8s/api/v1/factories.ts:108](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/factories.ts#L108)

***

### post()

```ts
post: (body: RecursivePartial<KubeObjectInterface>, queryParams?: QueryParameters, cluster?: string) => Promise<any>;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `body` | `RecursivePartial`\<[`KubeObjectInterface`](../../../../KubeObject/interfaces/KubeObjectInterface.md)\> |
| `queryParams`? | [`QueryParameters`](../../queryParameters/interfaces/QueryParameters.md) |
| `cluster`? | `string` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[frontend/src/lib/k8s/api/v1/factories.ts:98](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/factories.ts#L98)

***

### put()

```ts
put: (body: KubeObjectInterface, queryParams?: QueryParameters, cluster?: string) => Promise<ResourceType>;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `body` | [`KubeObjectInterface`](../../../../KubeObject/interfaces/KubeObjectInterface.md) |
| `queryParams`? | [`QueryParameters`](../../queryParameters/interfaces/QueryParameters.md) |
| `cluster`? | `string` |

#### Returns

`Promise`\<`ResourceType`\>

#### Defined in

[frontend/src/lib/k8s/api/v1/factories.ts:103](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/factories.ts#L103)

***

### scale?

```ts
optional scale: ScaleApi;
```

#### Defined in

[frontend/src/lib/k8s/api/v1/factories.ts:127](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/factories.ts#L127)
