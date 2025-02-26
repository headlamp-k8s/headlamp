# Interface: KubeMetadata

KubeMetadata contains the metadata that is common to all Kubernetes objects.

## See

[Metadata](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#metadata) for more details.

## Properties

### annotations?

```ts
optional annotations: StringDict;
```

A map of string keys and values that can be used by external tooling to store and
retrieve arbitrary metadata about this object

#### See

[annotations docs](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/) for more details.

#### Defined in

[frontend/src/lib/k8s/KubeMetadata.ts:15](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeMetadata.ts#L15)

***

### apiVersion?

```ts
optional apiVersion: any;
```

#### Defined in

[frontend/src/lib/k8s/KubeMetadata.ts:134](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeMetadata.ts#L134)

***

### creationTimestamp

```ts
creationTimestamp: string;
```

An RFC 3339 date of the date and time an object was created

#### Defined in

[frontend/src/lib/k8s/KubeMetadata.ts:19](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeMetadata.ts#L19)

***

### deletionGracePeriodSeconds?

```ts
optional deletionGracePeriodSeconds: number;
```

Number of seconds allowed for this object to gracefully terminate before it
will be removed from the system. Only set when deletionTimestamp is also set.
May only be shortened.
Read-only.

#### Defined in

[frontend/src/lib/k8s/KubeMetadata.ts:26](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeMetadata.ts#L26)

***

### deletionTimestamp?

```ts
optional deletionTimestamp: string;
```

An RFC 3339 date of the date and time after which this resource will be deleted.
This field is set by the server when a graceful deletion is requested by the
user, and is not directly settable by a client. The resource will be deleted
(no longer visible from resource lists, and not reachable by name) after the
time in this field except when the object has a finalizer set. In case the
finalizer is set the deletion of the object is postponed at least until the
finalizer is removed. Once the deletionTimestamp is set, this value may not
be unset or be set further into the future, although it may be shortened or
the resource may be deleted prior to this time.

#### Defined in

[frontend/src/lib/k8s/KubeMetadata.ts:38](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeMetadata.ts#L38)

***

### finalizers?

```ts
optional finalizers: string[];
```

Must be empty before the object is deleted from the registry. Each entry is
an identifier for the responsible component that will remove the entry from
the list. If the deletionTimestamp of the object is non-nil, entries in this
list can only be removed. Finalizers may be processed and removed in any order.
Order is NOT enforced because it introduces significant risk of stuck finalizers.
finalizers is a shared field, any actor with permission can reorder it.
If the finalizer list is processed in order, then this can lead to a situation
in which the component responsible for the first finalizer in the list is
waiting for a signal (field value, external system, or other) produced by a
component responsible for a finalizer later in the list, resulting in a deadlock.
Without enforced ordering finalizers are free to order amongst themselves and
are not vulnerable to ordering changes in the list.

patch strategy: merge

#### Defined in

[frontend/src/lib/k8s/KubeMetadata.ts:55](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeMetadata.ts#L55)

***

### generateName?

```ts
optional generateName: string;
```

GenerateName is an optional prefix, used by the server, to generate a unique
name ONLY IF the Name field has not been provided. If this field is used,
the name returned to the client will be different than the name passed.
This value will also be combined with a unique suffix. The provided value
has the same validation rules as the Name field, and may be truncated by
the length of the suffix required to make the value unique on the server.
If this field is specified and the generated name exists, the server will
return a 409. Applied only if Name is not specified.

#### See

[more info](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#idempotency)

#### Defined in

[frontend/src/lib/k8s/KubeMetadata.ts:68](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeMetadata.ts#L68)

***

### generation?

```ts
optional generation: number;
```

A sequence number representing a specific generation of the desired state.
Populated by the system.
Read-only.

#### Defined in

[frontend/src/lib/k8s/KubeMetadata.ts:74](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeMetadata.ts#L74)

***

### labels?

```ts
optional labels: StringDict;
```

A map of string keys and values that can be used to organize and categorize objects

#### See

https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/

#### Defined in

[frontend/src/lib/k8s/KubeMetadata.ts:80](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeMetadata.ts#L80)

***

### managedFields?

```ts
optional managedFields: KubeManagedFieldsEntry[];
```

Maps workflow-id and version to the set of fields that are managed by that workflow.
This is mostly for internal housekeeping, and users typically shouldn't need to set
or understand this field. A workflow can be the user's name, a controller's name, or
the name of a specific apply path like "ci-cd". The set of fields is always in the
version that the workflow used when modifying the object.

#### Defined in

[frontend/src/lib/k8s/KubeMetadata.ts:88](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeMetadata.ts#L88)

***

### name

```ts
name: string;
```

Uniquely identifies this object within the current namespace (see the identifiers docs).
This value is used in the path when retrieving an individual object.

#### See

[Names docs](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/) for more details.

#### Defined in

[frontend/src/lib/k8s/KubeMetadata.ts:95](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeMetadata.ts#L95)

***

### namespace?

```ts
optional namespace: string;
```

Namespace defines the space within which each name must be unique. An empty namespace is
equivalent to the "default" namespace, but "default" is the canonical representation.
Not all objects are required to be scoped to a namespace - the value of this field for
those objects will be empty. Must be a DNS_LABEL. Cannot be updated.

#### See

[Namespaces docs](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) for more details.

#### Defined in

[frontend/src/lib/k8s/KubeMetadata.ts:104](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeMetadata.ts#L104)

***

### ownerReferences?

```ts
optional ownerReferences: KubeOwnerReference[];
```

List of objects depended by this object. If ALL objects in the list have been deleted,
this object will be garbage collected. If this object is managed by a controller,
then an entry in this list will point to this controller, with the controller field
set to true. There cannot be more than one managing controller.

#### Defined in

[frontend/src/lib/k8s/KubeMetadata.ts:111](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeMetadata.ts#L111)

***

### resourceVersion?

```ts
optional resourceVersion: string;
```

Identifies the internal version of this object that can be used by clients to
determine when objects have changed. This value MUST be treated as opaque by
clients and passed unmodified back to the server. Clients should not assume
that the resource version has meaning across namespaces, different kinds of
resources, or different servers.

#### See

[concurrency control docs](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency) for more details

#### Defined in

[frontend/src/lib/k8s/KubeMetadata.ts:121](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeMetadata.ts#L121)

***

### selfLink?

```ts
optional selfLink: string;
```

Deprecated: selfLink is a legacy read-only field that is no longer populated by the system.

#### Defined in

[frontend/src/lib/k8s/KubeMetadata.ts:125](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeMetadata.ts#L125)

***

### uid

```ts
uid: string;
```

UID is the unique in time and space value for this object. It is typically generated by
the server on successful creation of a resource and is not allowed to change on PUT
operations. Populated by the system. Read-only.

#### See

[UIDs docs](https://kubernetes.io/docs/concepts/overview/working-with-objects/names#uids) for more details.

#### Defined in

[frontend/src/lib/k8s/KubeMetadata.ts:133](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/KubeMetadata.ts#L133)
