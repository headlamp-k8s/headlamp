# Interface: ~~KubeManagedFields~~

## Deprecated

For backwards compatibility, please use KubeManagedFieldsEntry

## Extends

- [`KubeManagedFieldsEntry`](KubeManagedFieldsEntry.md)

## Properties

### ~~apiVersion~~

```ts
apiVersion: string;
```

APIVersion defines the version of this resource that this field set applies to.
The format is "group/version" just like the top-level APIVersion field.
It is necessary to track the version of a field set because it cannot be
automatically converted.

#### Inherited from

[`KubeManagedFieldsEntry`](KubeManagedFieldsEntry.md).[`apiVersion`](KubeManagedFieldsEntry.md#apiversion)

#### Defined in

[frontend/src/lib/k8s/cluster.ts:94](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L94)

***

### ~~fieldsType~~

```ts
fieldsType: string;
```

FieldsType is the discriminator for the different fields format and version.
There is currently only one possible value: "FieldsV1"

#### Inherited from

[`KubeManagedFieldsEntry`](KubeManagedFieldsEntry.md).[`fieldsType`](KubeManagedFieldsEntry.md#fieldstype)

#### Defined in

[frontend/src/lib/k8s/cluster.ts:99](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L99)

***

### ~~fieldsV1~~

```ts
fieldsV1: object;
```

FieldsV1 holds the first JSON version format as described in the "FieldsV1" type.

#### Inherited from

[`KubeManagedFieldsEntry`](KubeManagedFieldsEntry.md).[`fieldsV1`](KubeManagedFieldsEntry.md#fieldsv1)

#### Defined in

[frontend/src/lib/k8s/cluster.ts:103](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L103)

***

### ~~manager~~

```ts
manager: string;
```

Manager is an identifier of the workflow managing these fields.

#### Inherited from

[`KubeManagedFieldsEntry`](KubeManagedFieldsEntry.md).[`manager`](KubeManagedFieldsEntry.md#manager)

#### Defined in

[frontend/src/lib/k8s/cluster.ts:107](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L107)

***

### ~~operation~~

```ts
operation: string;
```

Operation is the type of operation which lead to this ManagedFieldsEntry being
created. The only valid values for this field are 'Apply' and 'Update'.

#### Inherited from

[`KubeManagedFieldsEntry`](KubeManagedFieldsEntry.md).[`operation`](KubeManagedFieldsEntry.md#operation)

#### Defined in

[frontend/src/lib/k8s/cluster.ts:112](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L112)

***

### ~~subresource~~

```ts
subresource: string;
```

Subresource is the name of the subresource used to update that object, or empty
string if the object was updated through the main resource. The value of this
field is used to distinguish between managers, even if they share the same name.
For example, a status update will be distinct from a regular update using the
same manager name. Note that the APIVersion field is not related to the
Subresource field and it always corresponds to the version of the main resource.

#### Inherited from

[`KubeManagedFieldsEntry`](KubeManagedFieldsEntry.md).[`subresource`](KubeManagedFieldsEntry.md#subresource)

#### Defined in

[frontend/src/lib/k8s/cluster.ts:121](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L121)

***

### ~~timestamp~~

```ts
timestamp: string;
```

Time is the timestamp of when the ManagedFields entry was added.The timestamp
will also be updated if a field is added, the manager changes any of the owned
fields value or removes a field. The timestamp does not update when a field is
removed from the entry because another manager took it over.

#### Inherited from

[`KubeManagedFieldsEntry`](KubeManagedFieldsEntry.md).[`timestamp`](KubeManagedFieldsEntry.md#timestamp)

#### Defined in

[frontend/src/lib/k8s/cluster.ts:128](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L128)
