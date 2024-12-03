# Class: KubeObject\<T\>

## Extended by

- [`ConfigMap`](../../configMap/classes/ConfigMap.md)
- [`CustomResourceDefinition`](../../crd/classes/CustomResourceDefinition.md)
- [`CronJob`](../../cronJob/classes/CronJob.md)
- [`DaemonSet`](../../daemonSet/classes/DaemonSet.md)
- [`Deployment`](../../deployment/classes/Deployment.md)
- [`Endpoints`](../../endpoints/classes/Endpoints.md)
- [`Event`](../../event/classes/Event.md)
- [`HPA`](../../hpa/classes/HPA.md)
- [`Ingress`](../../ingress/classes/Ingress.md)
- [`IngressClass`](../../ingressClass/classes/IngressClass.md)
- [`Job`](../../job/classes/Job.md)
- [`Lease`](../../lease/classes/Lease.md)
- [`LimitRange`](../../limitRange/classes/LimitRange.md)
- [`MutatingWebhookConfiguration`](../../mutatingWebhookConfiguration/classes/MutatingWebhookConfiguration.md)
- [`Namespace`](../../namespace/classes/Namespace.md)
- [`NetworkPolicy`](../../networkpolicy/classes/NetworkPolicy.md)
- [`Node`](../../node/classes/Node.md)
- [`PersistentVolume`](../../persistentVolume/classes/PersistentVolume.md)
- [`PersistentVolumeClaim`](../../persistentVolumeClaim/classes/PersistentVolumeClaim.md)
- [`Pod`](../../pod/classes/Pod.md)
- [`PDB`](../../podDisruptionBudget/classes/PDB.md)
- [`PriorityClass`](../../priorityClass/classes/PriorityClass.md)
- [`ReplicaSet`](../../replicaSet/classes/ReplicaSet.md)
- [`ResourceQuota`](../../resourceQuota/classes/ResourceQuota.md)
- [`Role`](../../role/classes/Role.md)
- [`RoleBinding`](../../roleBinding/classes/RoleBinding.md)
- [`RuntimeClass`](../../runtime/classes/RuntimeClass.md)
- [`Secret`](../../secret/classes/Secret.md)
- [`Service`](../../service/classes/Service.md)
- [`ServiceAccount`](../../serviceAccount/classes/ServiceAccount.md)
- [`StatefulSet`](../../statefulSet/classes/StatefulSet.md)
- [`StorageClass`](../../storageClass/classes/StorageClass.md)
- [`ValidatingWebhookConfiguration`](../../validatingWebhookConfiguration/classes/ValidatingWebhookConfiguration.md)
- [`VPA`](../../vpa/classes/VPA.md)

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`KubeObjectInterface`](../interfaces/KubeObjectInterface.md) \| [`KubeEvent`](../../event/interfaces/KubeEvent.md) | `any` |

## Constructors

### new KubeObject()

```ts
new KubeObject<T>(json: T, cluster?: string): KubeObject<T>
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `json` | `T` |
| `cluster`? | `string` |

#### Returns

[`KubeObject`](KubeObject.md)\<`T`\>

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:76](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L76)

## Properties

| Property | Modifier | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `_clusterName` | `public` | `string` | `undefined` | - | [frontend/src/lib/k8s/KubeObject.ts:29](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L29) |
| `jsonData` | `public` | `T` | `undefined` | - | [frontend/src/lib/k8s/KubeObject.ts:26](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L26) |
| `_internalApiEndpoint?` | `static` | [`ApiClient`](../../api/v1/factories/interfaces/ApiClient.md)\<[`KubeObjectInterface`](../interfaces/KubeObjectInterface.md)\> \| [`ApiWithNamespaceClient`](../../api/v1/factories/interfaces/ApiWithNamespaceClient.md)\<[`KubeObjectInterface`](../interfaces/KubeObjectInterface.md)\> | `undefined` | - | [frontend/src/lib/k8s/KubeObject.ts:43](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L43) |
| `apiName` | `readonly` | `string` | `undefined` | Name of the resource, plural, used in API | [frontend/src/lib/k8s/KubeObject.ts:35](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L35) |
| `apiVersion` | `readonly` | `string` \| `string`[] | `undefined` | Group and version of the resource formatted as "GROUP/VERSION", e.g. "policy.k8s.io/v1". | [frontend/src/lib/k8s/KubeObject.ts:38](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L38) |
| `isNamespaced` | `readonly` | `boolean` | `undefined` | Whether the object is namespaced. | [frontend/src/lib/k8s/KubeObject.ts:41](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L41) |
| `kind` | `readonly` | `string` | `undefined` | The kind of the object. Corresponding to the resource kind in Kubernetes. | [frontend/src/lib/k8s/KubeObject.ts:32](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L32) |
| `readOnlyFields` | `static` | `string`[] | `[]` | Readonly field defined as JSONPath paths | [frontend/src/lib/k8s/KubeObject.ts:28](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L28) |

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

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:107](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L107)

***

### apiEndpoint

#### Get Signature

```ts
get static apiEndpoint(): ApiClient<KubeObjectInterface> | ApiWithNamespaceClient<KubeObjectInterface>
```

##### Returns

[`ApiClient`](../../api/v1/factories/interfaces/ApiClient.md)\<[`KubeObjectInterface`](../interfaces/KubeObjectInterface.md)\> \| [`ApiWithNamespaceClient`](../../api/v1/factories/interfaces/ApiWithNamespaceClient.md)\<[`KubeObjectInterface`](../interfaces/KubeObjectInterface.md)\>

#### Set Signature

```ts
set static apiEndpoint(endpoint: ApiClient<KubeObjectInterface> | ApiWithNamespaceClient<KubeObjectInterface>): void
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `endpoint` | [`ApiClient`](../../api/v1/factories/interfaces/ApiClient.md)\<[`KubeObjectInterface`](../interfaces/KubeObjectInterface.md)\> \| [`ApiWithNamespaceClient`](../../api/v1/factories/interfaces/ApiWithNamespaceClient.md)\<[`KubeObjectInterface`](../interfaces/KubeObjectInterface.md)\> |

##### Returns

`void`

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

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:101](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L101)

## Methods

### \_class()

```ts
_class(): typeof KubeObject
```

#### Returns

*typeof* [`KubeObject`](KubeObject.md)

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:409](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L409)

***

### delete()

```ts
delete(): Promise<any>
```

#### Returns

`Promise`\<`any`\>

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:413](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L413)

***

### getAge()

```ts
getAge(): string
```

#### Returns

`string`

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
| `reqResourseAttrs`? | [`AuthRequestResourceAttrs`](../interfaces/AuthRequestResourceAttrs.md) |

#### Returns

`Promise`\<`any`\>

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:559](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L559)

***

### getCreationTs()

```ts
getCreationTs(): string
```

#### Returns

`string`

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:145](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L145)

***

### getDetailsLink()

```ts
getDetailsLink(): string
```

#### Returns

`string`

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:124](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L124)

***

### getEditableObject()

```ts
getEditableObject(): object
```

#### Returns

`object`

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:165](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L165)

***

### getListLink()

```ts
getListLink(): string
```

#### Returns

`string`

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:133](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L133)

***

### getName()

```ts
getName(): string
```

#### Returns

`string`

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:137](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L137)

***

### getNamespace()

```ts
getNamespace(): undefined | string
```

#### Returns

`undefined` \| `string`

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
| `data` | [`KubeObjectInterface`](../interfaces/KubeObjectInterface.md) |

#### Returns

`Promise`\<[`KubeObjectInterface`](../interfaces/KubeObjectInterface.md)\>

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
| `K` *extends* [`KubeObject`](KubeObject.md)\<`any`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `this` | (...`args`: `any`) => `K` & *typeof* [`KubeObject`](KubeObject.md) |
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
| `K` *extends* [`KubeObject`](KubeObject.md)\<`any`\> |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | (...`args`: `any`) => `K` & *typeof* [`KubeObject`](KubeObject.md) | - |
| `onList` | (`arg`: `K`[]) => `void` | Callback function to be called when the list is retrieved. |
| `onError`? | (`err`: [`ApiError`](../../api/v1/clusterRequests/interfaces/ApiError.md), `cluster`?: `string`) => `void` | Callback function to be called when an error occurs. |
| `opts`? | [`ApiListSingleNamespaceOptions`](../interfaces/ApiListSingleNamespaceOptions.md) | Options to be passed to the API endpoint. |

#### Returns

`Function`

The API endpoint for this object.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

##### Returns

`Promise`\<[`CancelFunction`](../../api/v1/factories/type-aliases/CancelFunction.md)\>

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
| `T` *extends* [`KubeObject`](KubeObject.md)\<`any`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `this` | (...`args`: `Args`) => `T` |
| ...`item` | `Args` |

#### Returns

`T`

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
| `reqResourseAttrs`? | [`AuthRequestResourceAttrs`](../interfaces/AuthRequestResourceAttrs.md) |

#### Returns

`Promise`\<`any`\>

The result of the access request.

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
| `reqResourseAttrs`? | [`AuthRequestResourceAttrs`](../interfaces/AuthRequestResourceAttrs.md) |

#### Returns

`Promise`\<`any`\>

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
| `data` | [`KubeObjectInterface`](../interfaces/KubeObjectInterface.md) |

#### Returns

`Promise`\<[`KubeObjectInterface`](../interfaces/KubeObjectInterface.md)\>

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
| `K` *extends* [`KubeObject`](KubeObject.md)\<`any`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `this` | (...`args`: `any`) => `K` & *typeof* [`KubeObject`](KubeObject.md) |
| `onGet` | (`item`: `null` \| `K`) => `any` |
| `name` | `string` |
| `namespace`? | `string` |
| `onError`? | (`err`: `null` \| [`ApiError`](../../api/v1/clusterRequests/interfaces/ApiError.md), `cluster`?: `string`) => `void` |
| `opts`? | \{ `cluster`: `string`; `queryParams`: [`QueryParameters`](../../api/v1/queryParameters/interfaces/QueryParameters.md); \} |
| `opts.cluster`? | `string` |
| `opts.queryParams`? | [`QueryParameters`](../../api/v1/queryParameters/interfaces/QueryParameters.md) |

#### Returns

`void`

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
| `K` *extends* [`KubeObject`](KubeObject.md)\<`any`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `this` | (...`args`: `any`) => `K` & *typeof* [`KubeObject`](KubeObject.md) |
| `onList` | (...`arg`: `any`[]) => `any` |
| `onError`? | (`err`: [`ApiError`](../../api/v1/clusterRequests/interfaces/ApiError.md), `cluster`?: `string`) => `void` |
| `opts`? | [`ApiListOptions`](../interfaces/ApiListOptions.md) |

#### Returns

`void`

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
| `K` *extends* [`KubeObject`](KubeObject.md)\<`any`\> |

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
| `K` *extends* [`KubeObject`](KubeObject.md)\<`any`\> |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `this` | (...`args`: `any`) => `K` & *typeof* [`KubeObject`](KubeObject.md) |
| `__namedParameters` | `object` & [`QueryParameters`](../../api/v1/queryParameters/interfaces/QueryParameters.md) |

#### Returns

[`null` \| `K`[], `null` \| [`ApiError`](../../api/v1/clusterRequests/interfaces/ApiError.md)] & [`QueryListResponse`](../../api/v2/hooks/interfaces/QueryListResponse.md)\<(`undefined` \| `null` \| [`ListResponse`](../../api/v2/useKubeObjectList/interfaces/ListResponse.md)\<`K`\>)[], `K`, [`ApiError`](../../api/v1/clusterRequests/interfaces/ApiError.md)\>

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:297](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L297)
