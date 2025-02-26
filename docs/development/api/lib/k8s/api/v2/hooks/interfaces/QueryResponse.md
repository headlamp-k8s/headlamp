# Interface: QueryResponse\<DataType, ErrorType\>

## Extended by

- [`QueryListResponse`](QueryListResponse.md)

## Type Parameters

| Type Parameter |
| ------ |
| `DataType` |
| `ErrorType` |

## Properties

### data

```ts
data: null | DataType;
```

The last successfully resolved data for the query.

#### Defined in

[frontend/src/lib/k8s/api/v2/hooks.ts:18](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/hooks.ts#L18)

***

### error

```ts
error: null | ErrorType;
```

The error object for the query, if an error was thrown.
- Defaults to `null`.

#### Defined in

[frontend/src/lib/k8s/api/v2/hooks.ts:23](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/hooks.ts#L23)

***

### isError

```ts
isError: boolean;
```

A derived boolean from the `status` variable, provided for convenience.
- `true` if the query attempt resulted in an error.

#### Defined in

[frontend/src/lib/k8s/api/v2/hooks.ts:28](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/hooks.ts#L28)

***

### isFetching

```ts
isFetching: boolean;
```

Is `true` whenever the query is executing, which includes initial fetch as well as background refetch.

#### Defined in

[frontend/src/lib/k8s/api/v2/hooks.ts:36](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/hooks.ts#L36)

***

### isLoading

```ts
isLoading: boolean;
```

Is `true` whenever the first fetch for a query is in-flight.

#### Defined in

[frontend/src/lib/k8s/api/v2/hooks.ts:32](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/hooks.ts#L32)

***

### isSuccess

```ts
isSuccess: boolean;
```

A derived boolean from the `status` variable, provided for convenience.
- `true` if the query has received a response with no errors and is ready to display its data.

#### Defined in

[frontend/src/lib/k8s/api/v2/hooks.ts:41](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/hooks.ts#L41)

***

### status

```ts
status: QueryStatus;
```

The status of the query.
- Will be:
  - `pending` if there's no cached data and no query attempt was finished yet.
  - `error` if the query attempt resulted in an error.
  - `success` if the query has received a response with no errors and is ready to display its data.

#### Defined in

[frontend/src/lib/k8s/api/v2/hooks.ts:49](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/hooks.ts#L49)
