# Function: asQuery()

```ts
function asQuery(queryParams?: QueryParameters): string
```

Converts k8s queryParams to a URL query string.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `queryParams`? | [`QueryParameters`](../../queryParameters/interfaces/QueryParameters.md) | The k8s API query parameters to convert. |

## Returns

`string`

The query string (starting with '?'), or empty string.

## Defined in

[frontend/src/lib/k8s/api/v1/formatUrl.ts:35](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/formatUrl.ts#L35)
