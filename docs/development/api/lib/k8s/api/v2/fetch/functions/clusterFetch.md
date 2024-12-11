# Function: clusterFetch()

```ts
function clusterFetch(url: string | URL, init: RequestInit & object): Promise<Response>
```

A wrapper around Fetch function
Allows sending requests to a particular cluster

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` \| `URL` | URL path |
| `init` | `RequestInit` & `object` | same as second parameter of the Fetch function |

## Returns

`Promise`\<`Response`\>

fetch Response

## Defined in

[frontend/src/lib/k8s/api/v2/fetch.ts:46](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/fetch.ts#L46)
