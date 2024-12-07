# Function: useTypedSelector()

## Call Signature

```ts
function useTypedSelector<TSelected>(selector: (state: object) => TSelected, equalityFn?: EqualityFn<NoInfer<TSelected>>): TSelected
```

### Type Parameters

| Type Parameter |
| ------ |
| `TSelected` |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `selector` | (`state`: `object`) => `TSelected` |
| `equalityFn`? | `EqualityFn`\<`NoInfer`\<`TSelected`\>\> |

### Returns

`TSelected`

### Defined in

[frontend/src/redux/reducers/reducers.tsx:38](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/redux/reducers/reducers.tsx#L38)

## Call Signature

```ts
function useTypedSelector<Selected>(selector: (state: object) => Selected, options?: UseSelectorOptions<Selected>): Selected
```

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `Selected` | `unknown` |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `selector` | (`state`: `object`) => `Selected` |
| `options`? | `UseSelectorOptions`\<`Selected`\> |

### Returns

`Selected`

### Defined in

[frontend/src/redux/reducers/reducers.tsx:38](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/redux/reducers/reducers.tsx#L38)
