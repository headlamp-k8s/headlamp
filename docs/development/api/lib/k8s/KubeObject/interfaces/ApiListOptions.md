# Interface: ApiListOptions

QueryParamaters is a map of query parameters for the Kubernetes API.

## Extends

- [`QueryParameters`](../../api/v1/queryParameters/interfaces/QueryParameters.md)

## Properties

### allowWatchBookmarks?

```ts
optional allowWatchBookmarks: string;
```

allowWatchBookmarks means watch events with type "BOOKMARK" will also be sent.

Can be 'true'

#### See

https://kubernetes.io/docs/reference/using-api/api-concepts/#watch-bookmarks

#### Inherited from

[`QueryParameters`](../../api/v1/queryParameters/interfaces/QueryParameters.md).[`allowWatchBookmarks`](../../api/v1/queryParameters/interfaces/QueryParameters.md#allowwatchbookmarks)

#### Defined in

[frontend/src/lib/k8s/api/v1/queryParameters.ts:83](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/queryParameters.ts#L83)

***

### cluster?

```ts
optional cluster: string;
```

The cluster to list objects from. By default uses the current cluster being viewed.
If clusters is set, then we use that and "cluster" is ignored.

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:660](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L660)

***

### clusters?

```ts
optional clusters: string[];
```

The clusters to list objects from. By default uses the current clusters being viewed.

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:653](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L653)

***

### continue?

```ts
optional continue: string;
```

Continue token for paging through large result sets.

The continue option should be set when retrieving more results from the server.
Since this value is server defined, clients may only use the continue value
from a previous query result with identical query parameters
(except for the value of continue) and the server may reject a continue value
it does not recognize. If the specified continue value is no longer valid
whether due to expiration (generally five to fifteen minutes) or a
configuration change on the server, the server will respond with a
410 ResourceExpired error together with a continue token. If the client
needs a consistent list, it must restart their list without the continue field.
Otherwise, the client may send another list request with the token received
with the 410 error, the server will respond with a list starting from the next
key, but from the latest snapshot, which is inconsistent from the previous
list results - objects that are created, modified, or deleted after the first
list request will be included in the response, as long as their keys are after
the "next key".

This field is not supported when watch is true. Clients may start a watch from
the last resourceVersion value returned by the server and not miss any modifications.

#### See

https://kubernetes.io/docs/reference/using-api/api-concepts/#retrieving-large-results-sets-in-chunks

#### Inherited from

[`QueryParameters`](../../api/v1/queryParameters/interfaces/QueryParameters.md).[`continue`](../../api/v1/queryParameters/interfaces/QueryParameters.md#continue)

#### Defined in

[frontend/src/lib/k8s/api/v1/queryParameters.ts:31](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/queryParameters.ts#L31)

***

### dryRun?

```ts
optional dryRun: string;
```

dryRun causes apiserver to simulate the request, and report whether the object would be modified.
Can be '' or 'All'

#### See

https://kubernetes.io/docs/reference/using-api/api-concepts/#dry-run

#### Inherited from

[`QueryParameters`](../../api/v1/queryParameters/interfaces/QueryParameters.md).[`dryRun`](../../api/v1/queryParameters/interfaces/QueryParameters.md#dryrun)

#### Defined in

[frontend/src/lib/k8s/api/v1/queryParameters.ts:38](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/queryParameters.ts#L38)

***

### fieldSelector?

```ts
optional fieldSelector: string;
```

fieldSeletor restricts the list of returned objects by their fields. Defaults to everything.

#### See

https://kubernetes.io/docs/concepts/overview/working-with-objects/field-selectors/

#### Inherited from

[`QueryParameters`](../../api/v1/queryParameters/interfaces/QueryParameters.md).[`fieldSelector`](../../api/v1/queryParameters/interfaces/QueryParameters.md#fieldselector)

#### Defined in

[frontend/src/lib/k8s/api/v1/queryParameters.ts:44](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/queryParameters.ts#L44)

***

### labelSelector?

```ts
optional labelSelector: string;
```

labelSelector restricts the list of returned objects by their labels. Defaults to everything.

#### See

 - https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#api
 - https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors

#### Inherited from

[`QueryParameters`](../../api/v1/queryParameters/interfaces/QueryParameters.md).[`labelSelector`](../../api/v1/queryParameters/interfaces/QueryParameters.md#labelselector)

#### Defined in

[frontend/src/lib/k8s/api/v1/queryParameters.ts:51](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/queryParameters.ts#L51)

***

### limit?

```ts
optional limit: string | number;
```

limit is a maximum number of responses to return for a list call.

If more items exist, the server will set the continue field on the list
metadata to a value that can be used with the same initial query to retrieve
the next set of results. Setting a limit may return fewer than the requested
amount of items (up to zero items) in the event all requested objects are
filtered out and clients should only use the presence of the continue field
to determine whether more results are available. Servers may choose not to
support the limit argument and will return all of the available results.
If limit is specified and the continue field is empty, clients may assume
that no more results are available.

This field is not supported if watch is true.

#### See

https://kubernetes.io/docs/reference/using-api/api-concepts/#retrieving-large-results-sets-in-chunks

#### Inherited from

[`QueryParameters`](../../api/v1/queryParameters/interfaces/QueryParameters.md).[`limit`](../../api/v1/queryParameters/interfaces/QueryParameters.md#limit)

#### Defined in

[frontend/src/lib/k8s/api/v1/queryParameters.ts:68](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/queryParameters.ts#L68)

***

### namespace?

```ts
optional namespace: string | string[];
```

The namespace to list objects from.

#### Defined in

[frontend/src/lib/k8s/KubeObject.ts:655](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeObject.ts#L655)

***

### pretty?

```ts
optional pretty: string;
```

If 'true', then the output is pretty printed.
Can be '' or 'true'

#### See

https://kubernetes.io/docs/reference/using-api/api-concepts/#output-options

#### Inherited from

[`QueryParameters`](../../api/v1/queryParameters/interfaces/QueryParameters.md).[`pretty`](../../api/v1/queryParameters/interfaces/QueryParameters.md#pretty)

#### Defined in

[frontend/src/lib/k8s/api/v1/queryParameters.ts:103](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/queryParameters.ts#L103)

***

### resourceVersion?

```ts
optional resourceVersion: string;
```

resourceVersion sets a constraint on what resource versions a request may be served from.
Defaults to unset

#### See

 - https://kubernetes.io/docs/reference/using-api/api-concepts/#efficient-detection-of-changes
 - https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions

#### Inherited from

[`QueryParameters`](../../api/v1/queryParameters/interfaces/QueryParameters.md).[`resourceVersion`](../../api/v1/queryParameters/interfaces/QueryParameters.md#resourceversion)

#### Defined in

[frontend/src/lib/k8s/api/v1/queryParameters.ts:76](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/queryParameters.ts#L76)

***

### resourceVersionMatch?

```ts
optional resourceVersionMatch: string;
```

The resource version to match.

#### See

https://kubernetes.io/docs/reference/using-api/api-concepts/#semantics-for-get-and-list

#### Inherited from

[`QueryParameters`](../../api/v1/queryParameters/interfaces/QueryParameters.md).[`resourceVersionMatch`](../../api/v1/queryParameters/interfaces/QueryParameters.md#resourceversionmatch)

#### Defined in

[frontend/src/lib/k8s/api/v1/queryParameters.ts:97](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/queryParameters.ts#L97)

***

### sendInitialEvents?

```ts
optional sendInitialEvents: string;
```

sendInitialEvents controls whether the server will send the events
for a watch before sending the current list state.

Can be 'true'.

#### See

https://kubernetes.io/docs/reference/using-api/api-concepts/#streaming-lists

#### Inherited from

[`QueryParameters`](../../api/v1/queryParameters/interfaces/QueryParameters.md).[`sendInitialEvents`](../../api/v1/queryParameters/interfaces/QueryParameters.md#sendinitialevents)

#### Defined in

[frontend/src/lib/k8s/api/v1/queryParameters.ts:91](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/queryParameters.ts#L91)

***

### watch?

```ts
optional watch: string;
```

watch instead of a list or get, watch for changes to the requested object(s).

Can be 1.

#### See

https://kubernetes.io/docs/reference/using-api/api-concepts/#efficient-detection-of-changes

#### Inherited from

[`QueryParameters`](../../api/v1/queryParameters/interfaces/QueryParameters.md).[`watch`](../../api/v1/queryParameters/interfaces/QueryParameters.md#watch)

#### Defined in

[frontend/src/lib/k8s/api/v1/queryParameters.ts:110](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/api/v1/queryParameters.ts#L110)
