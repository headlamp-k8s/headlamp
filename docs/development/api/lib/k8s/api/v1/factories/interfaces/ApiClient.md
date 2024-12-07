# Interface: ApiClient\<ResourceType\>

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

[frontend/src/lib/k8s/api/v1/factories.ts:75](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/factories.ts#L75)

***

### delete()

```ts
delete: (name: string, queryParams?: QueryParameters, cluster?: string) => Promise<any>;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `queryParams`? | [`QueryParameters`](../../queryParameters/interfaces/QueryParameters.md) |
| `cluster`? | `string` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[frontend/src/lib/k8s/api/v1/factories.ts:73](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/factories.ts#L73)

***

### get()

```ts
get: (name: string, cb: StreamResultsCb<ResourceType>, errCb: StreamErrCb, queryParams?: QueryParameters, cluster?: string) => Promise<CancelFunction>;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `cb` | [`StreamResultsCb`](../../streamingApi/type-aliases/StreamResultsCb.md)\<`ResourceType`\> |
| `errCb` | [`StreamErrCb`](../../streamingApi/type-aliases/StreamErrCb.md) |
| `queryParams`? | [`QueryParameters`](../../queryParameters/interfaces/QueryParameters.md) |
| `cluster`? | `string` |

#### Returns

`Promise`\<[`CancelFunction`](../type-aliases/CancelFunction.md)\>

#### Defined in

[frontend/src/lib/k8s/api/v1/factories.ts:50](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/factories.ts#L50)

***

### isNamespaced

```ts
isNamespaced: boolean;
```

#### Defined in

[frontend/src/lib/k8s/api/v1/factories.ts:74](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/factories.ts#L74)

***

### list()

```ts
list: (cb: StreamResultsCb<ResourceType>, errCb: StreamErrCb, queryParams?: QueryParameters, cluster?: string) => Promise<CancelFunction>;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `cb` | [`StreamResultsCb`](../../streamingApi/type-aliases/StreamResultsCb.md)\<`ResourceType`\> |
| `errCb` | [`StreamErrCb`](../../streamingApi/type-aliases/StreamErrCb.md) |
| `queryParams`? | [`QueryParameters`](../../queryParameters/interfaces/QueryParameters.md) |
| `cluster`? | `string` |

#### Returns

`Promise`\<[`CancelFunction`](../type-aliases/CancelFunction.md)\>

#### Defined in

[frontend/src/lib/k8s/api/v1/factories.ts:44](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/factories.ts#L44)

***

### patch()

```ts
patch: (body: OpPatch[], name: string, queryParams?: QueryParameters, cluster?: string) => Promise<ResourceType>;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `body` | `OpPatch`[] |
| `name` | `string` |
| `queryParams`? | [`QueryParameters`](../../queryParameters/interfaces/QueryParameters.md) |
| `cluster`? | `string` |

#### Returns

`Promise`\<`ResourceType`\>

#### Defined in

[frontend/src/lib/k8s/api/v1/factories.ts:67](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/factories.ts#L67)

***

### post()

```ts
post: (body: RecursivePartial<ResourceType>, queryParams?: QueryParameters, cluster?: string) => Promise<ResourceType>;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `body` | `RecursivePartial`\<`ResourceType`\> |
| `queryParams`? | [`QueryParameters`](../../queryParameters/interfaces/QueryParameters.md) |
| `cluster`? | `string` |

#### Returns

`Promise`\<`ResourceType`\>

#### Defined in

[frontend/src/lib/k8s/api/v1/factories.ts:57](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/factories.ts#L57)

***

### put()

```ts
put: (body: ResourceType, queryParams?: QueryParameters, cluster?: string) => Promise<ResourceType>;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `body` | `ResourceType` |
| `queryParams`? | [`QueryParameters`](../../queryParameters/interfaces/QueryParameters.md) |
| `cluster`? | `string` |

#### Returns

`Promise`\<`ResourceType`\>

#### Defined in

[frontend/src/lib/k8s/api/v1/factories.ts:62](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/factories.ts#L62)
