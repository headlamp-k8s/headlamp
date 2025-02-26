# Function: ~~makeCustomResourceClass()~~

## Call Signature

```ts
function makeCustomResourceClass(args: [string, string, string][], isNamespaced: boolean): KubeObjectClass
```

### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | [`string`, `string`, `string`][] |
| `isNamespaced` | `boolean` |

### Returns

[`KubeObjectClass`](../../KubeObject/type-aliases/KubeObjectClass.md)

### Deprecated

Use the version of the function that receives an object as its argument.

### Defined in

[frontend/src/lib/k8s/crd.ts:133](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/crd.ts#L133)

## Call Signature

```ts
function makeCustomResourceClass(args: CRClassArgs): KubeObjectClass
```

### Parameters

| Parameter | Type |
| ------ | ------ |
| `args` | [`CRClassArgs`](../interfaces/CRClassArgs.md) |

### Returns

[`KubeObjectClass`](../../KubeObject/type-aliases/KubeObjectClass.md)

### Deprecated

Use the version of the function that receives an object as its argument.

### Defined in

[frontend/src/lib/k8s/crd.ts:137](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/crd.ts#L137)
