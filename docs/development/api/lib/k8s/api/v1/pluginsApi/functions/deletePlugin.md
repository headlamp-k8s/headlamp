# Function: deletePlugin()

```ts
function deletePlugin(name: string): Promise<any>
```

Deletes the plugin with the specified name from the system.

This function sends a DELETE request to the server's plugin management
endpoint, targeting the plugin identified by its name.
The function handles the request asynchronously and returns a promise that
resolves with the server's response to the DELETE operation.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | The unique name of the plugin to delete. This identifier is used to construct the URL for the DELETE request. |

## Returns

`Promise`\<`any`\>

— A Promise that resolves to the JSON response from the API server.

## Throws

— An ApiError if the response status is not ok.

## Example

```ts
// Call to delete a plugin named 'examplePlugin'
deletePlugin('examplePlugin')
  .then(response => console.log('Plugin deleted successfully', response))
  .catch(error => console.error('Failed to delete plugin', error));
```

## Defined in

[frontend/src/lib/k8s/api/v1/pluginsApi.ts:25](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/pluginsApi.ts#L25)
