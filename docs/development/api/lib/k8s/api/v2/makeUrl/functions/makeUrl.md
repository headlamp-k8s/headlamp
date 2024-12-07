# Function: makeUrl()

```ts
function makeUrl(urlParts: string | any[], query: Record<string, any>): string
```

Formats URL path

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `urlParts` | `string` \| `any`[] | parts of the path, will be separated by / |
| `query` | `Record`\<`string`, `any`\> | query parameters object |

## Returns

`string`

Formatted URL path

## Example

```ts
makeUrl(["my", "path", 5], { name: "hello" })
// returns "/my/path/5?name=hello"
```

## Defined in

[frontend/src/lib/k8s/api/v2/makeUrl.ts:15](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/makeUrl.ts#L15)
