# Interface: QueryListResponse\<DataType, ItemType, ErrorType\>

Query response containing KubeList with added items field for convenience

## Extends

- [`QueryResponse`](QueryResponse.md)\<`DataType`, `ErrorType`\>

## Type Parameters

| Type Parameter |
| ------ |
| `DataType` |
| `ItemType` |
| `ErrorType` |

## Properties

### clusterErrors?

```ts
optional clusterErrors: null | Record<string, null | ApiError>;
```

Errors from individual clusters. Keyed by cluster name.

#### Defined in

[frontend/src/lib/k8s/api/v2/hooks.ts:65](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/hooks.ts#L65)

***

### clusterResults?

```ts
optional clusterResults: Record<string, QueryListResponse<DataType, ItemType, ErrorType>>;
```

Results from individual clusters. Keyed by cluster name.

#### Defined in

[frontend/src/lib/k8s/api/v2/hooks.ts:61](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/hooks.ts#L61)

***

### data

```ts
data: null | DataType;
```

The last successfully resolved data for the query.

#### Inherited from

[`QueryResponse`](QueryResponse.md).[`data`](QueryResponse.md#data)

#### Defined in

[frontend/src/lib/k8s/api/v2/hooks.ts:18](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/hooks.ts#L18)

***

### error

```ts
error: null | ErrorType;
```

The error object for the query, if an error was thrown.
- Defaults to `null`.

#### Inherited from

[`QueryResponse`](QueryResponse.md).[`error`](QueryResponse.md#error)

#### Defined in

[frontend/src/lib/k8s/api/v2/hooks.ts:23](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/hooks.ts#L23)

***

### isError

```ts
isError: boolean;
```

A derived boolean from the `status` variable, provided for convenience.
- `true` if the query attempt resulted in an error.

#### Inherited from

[`QueryResponse`](QueryResponse.md).[`isError`](QueryResponse.md#iserror)

#### Defined in

[frontend/src/lib/k8s/api/v2/hooks.ts:28](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/hooks.ts#L28)

***

### isFetching

```ts
isFetching: boolean;
```

Is `true` whenever the query is executing, which includes initial fetch as well as background refetch.

#### Inherited from

[`QueryResponse`](QueryResponse.md).[`isFetching`](QueryResponse.md#isfetching)

#### Defined in

[frontend/src/lib/k8s/api/v2/hooks.ts:36](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/hooks.ts#L36)

***

### isLoading

```ts
isLoading: boolean;
```

Is `true` whenever the first fetch for a query is in-flight.

#### Inherited from

[`QueryResponse`](QueryResponse.md).[`isLoading`](QueryResponse.md#isloading)

#### Defined in

[frontend/src/lib/k8s/api/v2/hooks.ts:32](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/hooks.ts#L32)

***

### isSuccess

```ts
isSuccess: boolean;
```

A derived boolean from the `status` variable, provided for convenience.
- `true` if the query has received a response with no errors and is ready to display its data.

#### Inherited from

[`QueryResponse`](QueryResponse.md).[`isSuccess`](QueryResponse.md#issuccess)

#### Defined in

[frontend/src/lib/k8s/api/v2/hooks.ts:41](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/hooks.ts#L41)

***

### items

```ts
items: null | ItemType[];
```

#### Defined in

[frontend/src/lib/k8s/api/v2/hooks.ts:57](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/hooks.ts#L57)

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

#### Inherited from

[`QueryResponse`](QueryResponse.md).[`status`](QueryResponse.md#status)

#### Defined in

[frontend/src/lib/k8s/api/v2/hooks.ts:49](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v2/hooks.ts#L49)
