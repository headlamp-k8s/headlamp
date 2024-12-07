# Function: singleApiFactory()

```ts
function singleApiFactory<T>(...__namedParameters: SingleApiFactoryArguments): ApiClient<T>
```

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`KubeObjectInterface`](../../../../KubeObject/interfaces/KubeObjectInterface.md) |

## Parameters

| Parameter | Type |
| ------ | ------ |
| ...`__namedParameters` | [`SingleApiFactoryArguments`](../type-aliases/SingleApiFactoryArguments.md) |

## Returns

[`ApiClient`](../interfaces/ApiClient.md)\<`T`\>

An object with methods for interacting with a single API endpoint.

## Defined in

[frontend/src/lib/k8s/api/v1/factories.ts:339](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/factories.ts#L339)
