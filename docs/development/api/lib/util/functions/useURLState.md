# Function: useURLState()

A hook to manage a state variable that is also stored in the URL.

## Param

The name of the key in the URL. If empty, then the hook behaves like useState.

## Param

The default value of the state variable, or the params object.

## Call Signature

```ts
function useURLState(key: string, defaultValue: number): [number, React.Dispatch<React.SetStateAction<number>>]
```

### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `defaultValue` | `number` |

### Returns

[`number`, `React.Dispatch`\<`React.SetStateAction`\<`number`\>\>]

### Defined in

[frontend/src/lib/util.ts:245](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/util.ts#L245)

## Call Signature

```ts
function useURLState(key: string, valueOrParams: number | URLStateParams<number>): [number, React.Dispatch<React.SetStateAction<number>>]
```

### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |
| `valueOrParams` | `number` \| `URLStateParams`\<`number`\> |

### Returns

[`number`, `React.Dispatch`\<`React.SetStateAction`\<`number`\>\>]

### Defined in

[frontend/src/lib/util.ts:249](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/util.ts#L249)
