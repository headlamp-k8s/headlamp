# Function: stopOrDeletePortForward()

```ts
function stopOrDeletePortForward(
   cluster: string, 
   id: string, 
stopOrDelete: boolean): Promise<string>
```

Stops or deletes a portforward with the specified details.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `cluster` | `string` | `undefined` | The cluster to portforward for. |
| `id` | `string` | `undefined` | The id to portforward for. |
| `stopOrDelete` | `boolean` | `true` | Whether to stop or delete the portforward. True for stop, false for delete. |

## Returns

`Promise`\<`string`\>

The response from the API.

## Throws

if the request fails.

## Defined in

[frontend/src/lib/k8s/api/v1/portForward.ts:98](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/portForward.ts#L98)
