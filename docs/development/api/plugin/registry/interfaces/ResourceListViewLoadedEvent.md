# Interface: ResourceListViewLoadedEvent

Event fired when a list view is loaded for a resource.

## Properties

### data

```ts
data: object;
```

#### error?

```ts
optional error: Error;
```

The error, if an error has occurred

#### resourceKind

```ts
resourceKind: string;
```

The kind of resource that was loaded.

#### resources

```ts
resources: KubeObject<any>[];
```

The list of resources that were loaded.

#### Defined in

[frontend/src/redux/headlampEventSlice.ts:255](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/redux/headlampEventSlice.ts#L255)

***

### type

```ts
type: LIST_VIEW;
```

#### Defined in

[frontend/src/redux/headlampEventSlice.ts:254](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/redux/headlampEventSlice.ts#L254)
