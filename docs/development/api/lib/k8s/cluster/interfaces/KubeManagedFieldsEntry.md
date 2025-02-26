# Interface: KubeManagedFieldsEntry

ManagedFieldsEntry is a workflow-id, a FieldSet and the group version of the
resource that the fieldset applies to.

## Extended by

- [`KubeManagedFields`](KubeManagedFields.md)

## Properties

### apiVersion

```ts
apiVersion: string;
```

APIVersion defines the version of this resource that this field set applies to.
The format is "group/version" just like the top-level APIVersion field.
It is necessary to track the version of a field set because it cannot be
automatically converted.

#### Defined in

[frontend/src/lib/k8s/cluster.ts:94](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L94)

***

### fieldsType

```ts
fieldsType: string;
```

FieldsType is the discriminator for the different fields format and version.
There is currently only one possible value: "FieldsV1"

#### Defined in

[frontend/src/lib/k8s/cluster.ts:99](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L99)

***

### fieldsV1

```ts
fieldsV1: object;
```

FieldsV1 holds the first JSON version format as described in the "FieldsV1" type.

#### Defined in

[frontend/src/lib/k8s/cluster.ts:103](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L103)

***

### manager

```ts
manager: string;
```

Manager is an identifier of the workflow managing these fields.

#### Defined in

[frontend/src/lib/k8s/cluster.ts:107](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L107)

***

### operation

```ts
operation: string;
```

Operation is the type of operation which lead to this ManagedFieldsEntry being
created. The only valid values for this field are 'Apply' and 'Update'.

#### Defined in

[frontend/src/lib/k8s/cluster.ts:112](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L112)

***

### subresource

```ts
subresource: string;
```

Subresource is the name of the subresource used to update that object, or empty
string if the object was updated through the main resource. The value of this
field is used to distinguish between managers, even if they share the same name.
For example, a status update will be distinct from a regular update using the
same manager name. Note that the APIVersion field is not related to the
Subresource field and it always corresponds to the version of the main resource.

#### Defined in

[frontend/src/lib/k8s/cluster.ts:121](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L121)

***

### timestamp

```ts
timestamp: string;
```

Time is the timestamp of when the ManagedFields entry was added.The timestamp
will also be updated if a field is added, the manager changes any of the owned
fields value or removes a field. The timestamp does not update when a field is
removed from the entry because another manager took it over.

#### Defined in

[frontend/src/lib/k8s/cluster.ts:128](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L128)
