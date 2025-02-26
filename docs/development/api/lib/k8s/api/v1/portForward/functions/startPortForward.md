# Function: startPortForward()

```ts
function startPortForward(
   cluster: string, 
   namespace: string, 
   podname: string, 
   containerPort: string | number, 
   service: string, 
   serviceNamespace: string, 
   port?: string, 
   address?: string, 
id?: string): Promise<PortForward>
```

Starts a portforward with the given details.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `cluster` | `string` | `undefined` | The cluster to portforward for. |
| `namespace` | `string` | `undefined` | The namespace to portforward for. |
| `podname` | `string` | `undefined` | The pod to portforward for. |
| `containerPort` | `string` \| `number` | `undefined` | The container port to portforward for. |
| `service` | `string` | `undefined` | The service to portforward for. |
| `serviceNamespace` | `string` | `undefined` | The service namespace to portforward for. |
| `port`? | `string` | `undefined` | The port to portforward for. |
| `address`? | `string` | `''` | - |
| `id`? | `string` | `''` | The id to portforward for. |

## Returns

`Promise`\<[`PortForward`](../interfaces/PortForward.md)\>

The response from the API.

## Throws

if the request fails.

## Defined in

[frontend/src/lib/k8s/api/v1/portForward.ts:48](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/portForward.ts#L48)
