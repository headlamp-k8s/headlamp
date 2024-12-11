# Interface: ResourceDetailsViewLoadedEvent

Event fired when a resource is loaded in the details view.

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

#### resource

```ts
resource: KubeObject<any>;
```

The resource that was loaded.

#### Defined in

[frontend/src/redux/headlampEventSlice.ts:242](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/redux/headlampEventSlice.ts#L242)

***

### type

```ts
type: DETAILS_VIEW;
```

#### Defined in

[frontend/src/redux/headlampEventSlice.ts:241](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/redux/headlampEventSlice.ts#L241)
