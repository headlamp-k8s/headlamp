# Class: MutatingWebhookConfiguration

## Extends

- [`KubeObject`](../../KubeObject/classes/KubeObject.md)\<[`KubeMutatingWebhookConfiguration`](../interfaces/KubeMutatingWebhookConfiguration.md)\>

## Constructors

### new MutatingWebhookConfiguration()

```ts
new MutatingWebhookConfiguration(json: KubeMutatingWebhookConfiguration, cluster?: string): MutatingWebhookConfiguration
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `json` | [`KubeMutatingWebhookConfiguration`](../interfaces/KubeMutatingWebhookConfiguration.md) |
| `cluster`? | `string` |

#### Returns

[`MutatingWebhookConfiguration`](MutatingWebhookConfiguration.md)

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`constructor`](../../KubeObject/classes/KubeObject.md#constructors)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:76](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L76)

## Properties

| Property | Modifier | Type | Default value | Description | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| `_clusterName` | `public` | `string` | `undefined` | - | - | [`KubeObject`](../../KubeObject/classes/KubeObject.md).`_clusterName` | [frontend/src/lib/k8s/KubeObject.ts:29](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L29) |
| `jsonData` | `public` | [`KubeMutatingWebhookConfiguration`](../interfaces/KubeMutatingWebhookConfiguration.md) | `undefined` | - | - | [`KubeObject`](../../KubeObject/classes/KubeObject.md).`jsonData` | [frontend/src/lib/k8s/KubeObject.ts:26](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L26) |
| `_internalApiEndpoint?` | `static` | [`ApiClient`](../../api/v1/factories/interfaces/ApiClient.md)\<[`KubeObjectInterface`](../../KubeObject/interfaces/KubeObjectInterface.md)\> \| [`ApiWithNamespaceClient`](../../api/v1/factories/interfaces/ApiWithNamespaceClient.md)\<[`KubeObjectInterface`](../../KubeObject/interfaces/KubeObjectInterface.md)\> | `undefined` | - | - | [`KubeObject`](../../KubeObject/classes/KubeObject.md).`_internalApiEndpoint` | [frontend/src/lib/k8s/KubeObject.ts:43](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L43) |
| `apiName` | `static` | `string` | `'mutatingwebhookconfigurations'` | Name of the resource, plural, used in API | [`KubeObject`](../../KubeObject/classes/KubeObject.md).`apiName` | - | [frontend/src/lib/k8s/mutatingWebhookConfiguration.ts:47](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/mutatingWebhookConfiguration.ts#L47) |
| `apiVersion` | `static` | `string` | `'admissionregistration.k8s.io/v1'` | Group and version of the resource formatted as "GROUP/VERSION", e.g. "policy.k8s.io/v1". | [`KubeObject`](../../KubeObject/classes/KubeObject.md).`apiVersion` | - | [frontend/src/lib/k8s/mutatingWebhookConfiguration.ts:48](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/mutatingWebhookConfiguration.ts#L48) |
| `isNamespaced` | `static` | `boolean` | `false` | Whether the object is namespaced. | [`KubeObject`](../../KubeObject/classes/KubeObject.md).`isNamespaced` | - | [frontend/src/lib/k8s/mutatingWebhookConfiguration.ts:49](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/mutatingWebhookConfiguration.ts#L49) |
| `kind` | `static` | `string` | `'MutatingWebhookConfiguration'` | The kind of the object. Corresponding to the resource kind in Kubernetes. | [`KubeObject`](../../KubeObject/classes/KubeObject.md).`kind` | - | [frontend/src/lib/k8s/mutatingWebhookConfiguration.ts:46](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/mutatingWebhookConfiguration.ts#L46) |
| `readOnlyFields` | `static` | `string`[] | `[]` | Readonly field defined as JSONPath paths | - | [`KubeObject`](../../KubeObject/classes/KubeObject.md).`readOnlyFields` | [frontend/src/lib/k8s/KubeObject.ts:28](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L28) |

## Accessors

### cluster

#### Get Signature

```ts
get cluster(): string
```

##### Returns

`string`

#### Set Signature

```ts
set cluster(cluster: string): void
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `cluster` | `string` |

##### Returns

`void`

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`cluster`](../../KubeObject/classes/KubeObject.md#cluster)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:81](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L81)

***

### detailsRoute

#### Get Signature

```ts
get detailsRoute(): string
```

##### Returns

`string`

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`detailsRoute`](../../KubeObject/classes/KubeObject.md#detailsroute)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:93](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L93)

***

### isNamespaced

#### Get Signature

```ts
get isNamespaced(): boolean
```

##### Returns

`boolean`

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`isNamespaced`](../../KubeObject/classes/KubeObject.md#isnamespaced)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:161](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L161)

***

### kind

#### Get Signature

```ts
get kind(): any
```

##### Returns

`any`

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`kind`](../../KubeObject/classes/KubeObject.md#kind)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:120](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L120)

***

### listRoute

#### Get Signature

```ts
get listRoute(): string
```

##### Returns

`string`

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`listRoute`](../../KubeObject/classes/KubeObject.md#listroute)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:112](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L112)

***

### metadata

#### Get Signature

```ts
get metadata(): KubeMetadata
```

##### Returns

[`KubeMetadata`](../../KubeMetadata/interfaces/KubeMetadata.md)

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`metadata`](../../KubeObject/classes/KubeObject.md#metadata)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:157](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L157)

***

### pluralName

#### Get Signature

```ts
get pluralName(): string
```

##### Returns

`string`

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`pluralName`](../../KubeObject/classes/KubeObject.md#pluralname)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:107](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L107)

***

### webhooks

#### Get Signature

```ts
get webhooks(): object[]
```

##### Returns

`object`[]

#### Defined in

[frontend/src/lib/k8s/mutatingWebhookConfiguration.ts:51](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/mutatingWebhookConfiguration.ts#L51)

***

### apiEndpoint

#### Get Signature

```ts
get static apiEndpoint(): ApiClient<KubeObjectInterface> | ApiWithNamespaceClient<KubeObjectInterface>
```

##### Returns

[`ApiClient`](../../api/v1/factories/interfaces/ApiClient.md)\<[`KubeObjectInterface`](../../KubeObject/interfaces/KubeObjectInterface.md)\> \| [`ApiWithNamespaceClient`](../../api/v1/factories/interfaces/ApiWithNamespaceClient.md)\<[`KubeObjectInterface`](../../KubeObject/interfaces/KubeObjectInterface.md)\>

#### Set Signature

```ts
set static apiEndpoint(endpoint: ApiClient<KubeObjectInterface> | ApiWithNamespaceClient<KubeObjectInterface>): void
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpoint` | [`ApiClient`](../../api/v1/factories/interfaces/ApiClient.md)\<[`KubeObjectInterface`](../../KubeObject/interfaces/KubeObjectInterface.md)\> \| [`ApiWithNamespaceClient`](../../api/v1/factories/interfaces/ApiWithNamespaceClient.md)\<[`KubeObjectInterface`](../../KubeObject/interfaces/KubeObjectInterface.md)\> |

##### Returns

`void`

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`apiEndpoint`](../../KubeObject/classes/KubeObject.md#apiendpoint)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:45](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L45)

***

### className

#### Get Signature

```ts
get static className(): string
```

##### Returns

`string`

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`className`](../../KubeObject/classes/KubeObject.md#classname)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:89](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L89)

***

### detailsRoute

#### Get Signature

```ts
get static detailsRoute(): string
```

##### Returns

`string`

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`detailsRoute`](../../KubeObject/classes/KubeObject.md#detailsroute-1)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:97](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L97)

***

### listRoute

#### Get Signature

```ts
get static listRoute(): string
```

##### Returns

`string`

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`listRoute`](../../KubeObject/classes/KubeObject.md#listroute-1)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:116](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L116)

***

### pluralName

#### Get Signature

```ts
get static pluralName(): string
```

##### Returns

`string`

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`pluralName`](../../KubeObject/classes/KubeObject.md#pluralname-1)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:101](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L101)

## Methods

### \_class()

```ts
_class(): typeof KubeObject
```

#### Returns

*typeof* [`KubeObject`](../../KubeObject/classes/KubeObject.md)

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`_class`](../../KubeObject/classes/KubeObject.md#_class)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:409](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L409)

***

### delete()

```ts
delete(): Promise<any>
```

#### Returns

`Promise`\<`any`\>

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`delete`](../../KubeObject/classes/KubeObject.md#delete)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:413](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L413)

***

### getAge()

```ts
getAge(): string
```

#### Returns

`string`

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`getAge`](../../KubeObject/classes/KubeObject.md#getage)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:149](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L149)

***

### getAuthorization()

```ts
getAuthorization(verb: string, reqResourseAttrs?: AuthRequestResourceAttrs): Promise<any>
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `verb` | `string` |
| `reqResourseAttrs`? | [`AuthRequestResourceAttrs`](../../KubeObject/interfaces/AuthRequestResourceAttrs.md) |

#### Returns

`Promise`\<`any`\>

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`getAuthorization`](../../KubeObject/classes/KubeObject.md#getauthorization)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:559](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L559)

***

### getCreationTs()

```ts
getCreationTs(): string
```

#### Returns

`string`

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`getCreationTs`](../../KubeObject/classes/KubeObject.md#getcreationts)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:145](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L145)

***

### getDetailsLink()

```ts
getDetailsLink(): string
```

#### Returns

`string`

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`getDetailsLink`](../../KubeObject/classes/KubeObject.md#getdetailslink)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:124](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L124)

***

### getEditableObject()

```ts
getEditableObject(): object
```

#### Returns

`object`

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`getEditableObject`](../../KubeObject/classes/KubeObject.md#geteditableobject)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:165](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L165)

***

### getListLink()

```ts
getListLink(): string
```

#### Returns

`string`

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`getListLink`](../../KubeObject/classes/KubeObject.md#getlistlink)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:133](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L133)

***

### getName()

```ts
getName(): string
```

#### Returns

`string`

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`getName`](../../KubeObject/classes/KubeObject.md#getname)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:137](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L137)

***

### getNamespace()

```ts
getNamespace(): undefined | string
```

#### Returns

`undefined` \| `string`

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`getNamespace`](../../KubeObject/classes/KubeObject.md#getnamespace)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:141](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L141)

***

### getValue()

```ts
getValue(prop: string): any
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `prop` | `string` |

#### Returns

`any`

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`getValue`](../../KubeObject/classes/KubeObject.md#getvalue)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:153](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L153)

***

### patch()

```ts
patch(body: OpPatch[]): Promise<any>
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `body` | `OpPatch`[] |

#### Returns

`Promise`\<`any`\>

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`patch`](../../KubeObject/classes/KubeObject.md#patch)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:460](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L460)

***

### scale()

```ts
scale(numReplicas: number): Promise<any>
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `numReplicas` | `number` |

#### Returns

`Promise`\<`any`\>

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`scale`](../../KubeObject/classes/KubeObject.md#scale)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:431](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L431)

***

### update()

```ts
update(data: KubeObjectInterface): Promise<KubeObjectInterface>
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`KubeObjectInterface`](../../KubeObject/interfaces/KubeObjectInterface.md) |

#### Returns

`Promise`\<[`KubeObjectInterface`](../../KubeObject/interfaces/KubeObjectInterface.md)\>

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`update`](../../KubeObject/classes/KubeObject.md#update)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:423](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L423)

***

### apiGet()

```ts
static apiGet<K>(
   this: (...args: any) => K & typeof KubeObject, 
   onGet: (...args: any) => void, 
   name: string, 
   namespace?: string, 
   onError?: (err: null | ApiError, cluster?: string) => void, 
opts?: object): (...args: any[]) => Promise<CancelFunction>
```

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* [`KubeObject`](../../KubeObject/classes/KubeObject.md)\<`any`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `this` | (...`args`: `any`) => `K` & *typeof* [`KubeObject`](../../KubeObject/classes/KubeObject.md) |
| `onGet` | (...`args`: `any`) => `void` |
| `name` | `string` |
| `namespace`? | `string` |
| `onError`? | (`err`: `null` \| [`ApiError`](../../api/v1/clusterRequests/interfaces/ApiError.md), `cluster`?: `string`) => `void` |
| `opts`? | \{ `cluster`: `string`; `queryParams`: [`QueryParameters`](../../api/v1/queryParameters/interfaces/QueryParameters.md); \} |
| `opts.cluster`? | `string` |
| `opts.queryParams`? | [`QueryParameters`](../../api/v1/queryParameters/interfaces/QueryParameters.md) |

#### Returns

`Function`

##### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

##### Returns

`Promise`\<[`CancelFunction`](../../api/v1/factories/type-aliases/CancelFunction.md)\>

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`apiGet`](../../KubeObject/classes/KubeObject.md#apiget)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:367](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L367)

***

### apiList()

```ts
static apiList<K>(
   this: (...args: any) => K & typeof KubeObject, 
   onList: (arg: K[]) => void, 
   onError?: (err: ApiError, cluster?: string) => void, 
opts?: ApiListSingleNamespaceOptions): (...args: any[]) => Promise<CancelFunction>
```

Returns the API endpoint for this object.

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* [`KubeObject`](../../KubeObject/classes/KubeObject.md)\<`any`\> |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | (...`args`: `any`) => `K` & *typeof* [`KubeObject`](../../KubeObject/classes/KubeObject.md) | - |
| `onList` | (`arg`: `K`[]) => `void` | Callback function to be called when the list is retrieved. |
| `onError`? | (`err`: [`ApiError`](../../api/v1/clusterRequests/interfaces/ApiError.md), `cluster`?: `string`) => `void` | Callback function to be called when an error occurs. |
| `opts`? | [`ApiListSingleNamespaceOptions`](../../KubeObject/interfaces/ApiListSingleNamespaceOptions.md) | Options to be passed to the API endpoint. |

#### Returns

`Function`

The API endpoint for this object.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

##### Returns

`Promise`\<[`CancelFunction`](../../api/v1/factories/type-aliases/CancelFunction.md)\>

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`apiList`](../../KubeObject/classes/KubeObject.md#apilist)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:195](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L195)

***

### create()

```ts
static create<Args, T>(this: (...args: Args) => T, ...item: Args): T
```

#### Type Parameters

| Type Parameter |
| ------ |
| `Args` *extends* `any`[] |
| `T` *extends* [`KubeObject`](../../KubeObject/classes/KubeObject.md)\<`any`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `this` | (...`args`: `Args`) => `T` |
| ...`item` | `Args` |

#### Returns

`T`

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`create`](../../KubeObject/classes/KubeObject.md#create)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:360](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L360)

***

### fetchAuthorization()

```ts
static fetchAuthorization(reqResourseAttrs?: AuthRequestResourceAttrs): Promise<any>
```

Performs a request to check if the user has the given permission.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `reqResourseAttrs`? | [`AuthRequestResourceAttrs`](../../KubeObject/interfaces/AuthRequestResourceAttrs.md) |

#### Returns

`Promise`\<`any`\>

The result of the access request.

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`fetchAuthorization`](../../KubeObject/classes/KubeObject.md#fetchauthorization)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:477](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L477)

***

### getAuthorization()

```ts
static getAuthorization(verb: string, reqResourseAttrs?: AuthRequestResourceAttrs): Promise<any>
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `verb` | `string` |
| `reqResourseAttrs`? | [`AuthRequestResourceAttrs`](../../KubeObject/interfaces/AuthRequestResourceAttrs.md) |

#### Returns

`Promise`\<`any`\>

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`getAuthorization`](../../KubeObject/classes/KubeObject.md#getauthorization-1)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:504](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L504)

***

### getErrorMessage()

```ts
static getErrorMessage(err: null | ApiError): null | "Error: Not found" | "Error: No permissions" | "Error"
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `err` | `null` \| [`ApiError`](../../api/v1/clusterRequests/interfaces/ApiError.md) |

#### Returns

`null` \| `"Error: Not found"` \| `"Error: No permissions"` \| `"Error"`

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`getErrorMessage`](../../KubeObject/classes/KubeObject.md#geterrormessage)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:588](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L588)

***

### put()

```ts
static put(data: KubeObjectInterface): Promise<KubeObjectInterface>
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | [`KubeObjectInterface`](../../KubeObject/interfaces/KubeObjectInterface.md) |

#### Returns

`Promise`\<[`KubeObjectInterface`](../../KubeObject/interfaces/KubeObjectInterface.md)\>

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`put`](../../KubeObject/classes/KubeObject.md#put)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:427](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L427)

***

### useApiGet()

```ts
static useApiGet<K>(
   this: (...args: any) => K & typeof KubeObject, 
   onGet: (item: null | K) => any, 
   name: string, 
   namespace?: string, 
   onError?: (err: null | ApiError, cluster?: string) => void, 
   opts?: object): void
```

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* [`KubeObject`](../../KubeObject/classes/KubeObject.md)\<`any`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `this` | (...`args`: `any`) => `K` & *typeof* [`KubeObject`](../../KubeObject/classes/KubeObject.md) |
| `onGet` | (`item`: `null` \| `K`) => `any` |
| `name` | `string` |
| `namespace`? | `string` |
| `onError`? | (`err`: `null` \| [`ApiError`](../../api/v1/clusterRequests/interfaces/ApiError.md), `cluster`?: `string`) => `void` |
| `opts`? | \{ `cluster`: `string`; `queryParams`: [`QueryParameters`](../../api/v1/queryParameters/interfaces/QueryParameters.md); \} |
| `opts.cluster`? | `string` |
| `opts.queryParams`? | [`QueryParameters`](../../api/v1/queryParameters/interfaces/QueryParameters.md) |

#### Returns

`void`

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`useApiGet`](../../KubeObject/classes/KubeObject.md#useapiget)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:392](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L392)

***

### useApiList()

```ts
static useApiList<K>(
   this: (...args: any) => K & typeof KubeObject, 
   onList: (...arg: any[]) => any, 
   onError?: (err: ApiError, cluster?: string) => void, 
   opts?: ApiListOptions): void
```

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* [`KubeObject`](../../KubeObject/classes/KubeObject.md)\<`any`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `this` | (...`args`: `any`) => `K` & *typeof* [`KubeObject`](../../KubeObject/classes/KubeObject.md) |
| `onList` | (...`arg`: `any`[]) => `any` |
| `onError`? | (`err`: [`ApiError`](../../api/v1/clusterRequests/interfaces/ApiError.md), `cluster`?: `string`) => `void` |
| `opts`? | [`ApiListOptions`](../../KubeObject/interfaces/ApiListOptions.md) |

#### Returns

`void`

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`useApiList`](../../KubeObject/classes/KubeObject.md#useapilist)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:228](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L228)

***

### useGet()

```ts
static useGet<K>(
   this: (...args: any) => K, 
   name: string, 
   namespace?: string, 
opts?: object): [null | K, null | ApiError] & QueryResponse<K, ApiError>
```

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* [`KubeObject`](../../KubeObject/classes/KubeObject.md)\<`any`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `this` | (...`args`: `any`) => `K` |
| `name` | `string` |
| `namespace`? | `string` |
| `opts`? | \{ `cluster`: `string`; `queryParams`: [`QueryParameters`](../../api/v1/queryParameters/interfaces/QueryParameters.md); \} |
| `opts.cluster`? | `string` |
| `opts.queryParams`? | [`QueryParameters`](../../api/v1/queryParameters/interfaces/QueryParameters.md) |

#### Returns

[`null` \| `K`, `null` \| [`ApiError`](../../api/v1/clusterRequests/interfaces/ApiError.md)] & [`QueryResponse`](../../api/v2/hooks/interfaces/QueryResponse.md)\<`K`, [`ApiError`](../../api/v1/clusterRequests/interfaces/ApiError.md)\>

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`useGet`](../../KubeObject/classes/KubeObject.md#useget)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:342](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L342)

***

### useList()

```ts
static useList<K>(this: (...args: any) => K & typeof KubeObject, __namedParameters: object & QueryParameters): [null | K[], null | ApiError] & QueryListResponse<(undefined | null | ListResponse<K>)[], K, ApiError>
```

#### Type Parameters

| Type Parameter |
| ------ |
| `K` *extends* [`KubeObject`](../../KubeObject/classes/KubeObject.md)\<`any`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `this` | (...`args`: `any`) => `K` & *typeof* [`KubeObject`](../../KubeObject/classes/KubeObject.md) |
| `__namedParameters` | `object` & [`QueryParameters`](../../api/v1/queryParameters/interfaces/QueryParameters.md) |

#### Returns

[`null` \| `K`[], `null` \| [`ApiError`](../../api/v1/clusterRequests/interfaces/ApiError.md)] & [`QueryListResponse`](../../api/v2/hooks/interfaces/QueryListResponse.md)\<(`undefined` \| `null` \| [`ListResponse`](../../api/v2/useKubeObjectList/interfaces/ListResponse.md)\<`K`\>)[], `K`, [`ApiError`](../../api/v1/clusterRequests/interfaces/ApiError.md)\>

#### Inherited from

[`KubeObject`](../../KubeObject/classes/KubeObject.md).[`useList`](../../KubeObject/classes/KubeObject.md#uselist)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:297](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L297)
