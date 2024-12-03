# Interface: KubeOwnerReference

## Properties

### apiVersion

```ts
apiVersion: string;
```

API version of the referent.

#### Defined in

[frontend/src/lib/k8s/cluster.ts:60](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L60)

***

### blockOwnerDeletion

```ts
blockOwnerDeletion: boolean;
```

If true, AND if the owner has the "foregroundDeletion" finalizer, then the owner cannot
be deleted from the key-value store until this reference is removed.

#### See

[foreground deletion](https://kubernetes.io/docs/concepts/architecture/garbage-collection/#foreground-deletion)
for how the garbage collector interacts with this field and enforces the foreground deletion.

Defaults to false. To set this field, a user needs "delete" permission of the owner,
otherwise 422 (Unprocessable Entity) will be returned.

#### Defined in

[frontend/src/lib/k8s/cluster.ts:72](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L72)

***

### controller

```ts
controller: boolean;
```

If true, this reference points to the managing controller.

#### Defined in

[frontend/src/lib/k8s/cluster.ts:74](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L74)

***

### kind

```ts
kind: string;
```

Kind of the referent.

#### Defined in

[frontend/src/lib/k8s/cluster.ts:76](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L76)

***

### name

```ts
name: string;
```

Name of the referent.

#### Defined in

[frontend/src/lib/k8s/cluster.ts:78](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L78)

***

### uid

```ts
uid: string;
```

UID of the referent.

#### Defined in

[frontend/src/lib/k8s/cluster.ts:80](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L80)
