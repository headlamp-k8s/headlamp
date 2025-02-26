# Function: multipleApiFactory()

```ts
function multipleApiFactory<T>(...args: MultipleApiFactoryArguments): ApiClient<T>
```

Creates an API endpoint object for multiple API endpoints.
It first tries the first endpoint, then the second, and so on until it
gets a successful response.

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`KubeObjectInterface`](../../../../KubeObject/interfaces/KubeObjectInterface.md) |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`args` | [`MultipleApiFactoryArguments`](../type-aliases/MultipleApiFactoryArguments.md) | An array of arguments to pass to the `singleApiFactory` function. |

## Returns

[`ApiClient`](../interfaces/ApiClient.md)\<`T`\>

An API endpoint object.

## Defined in

[frontend/src/lib/k8s/api/v1/factories.ts:290](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/factories.ts#L290)
