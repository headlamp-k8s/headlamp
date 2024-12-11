# Function: refreshToken()

```ts
function refreshToken(token: null | string): Promise<void>
```

Refreshes the token if it is about to expire.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `token` | `null` \| `string` | The token to refresh. For null token it just does nothing. |

## Returns

`Promise`\<`void`\>

## Note

Sets the token with `setToken` if the token is refreshed.

## Note

Uses global `isTokenRefreshInProgress` to prevent multiple token
refreshes at the same time.

## Defined in

[frontend/src/lib/k8s/api/v1/tokenApi.ts:25](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/tokenApi.ts#L25)
