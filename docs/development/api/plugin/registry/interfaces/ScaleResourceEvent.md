# Interface: ScaleResourceEvent

Event fired when scaling a resource.

## Properties

### data

```ts
data: object;
```

#### resource

```ts
resource: KubeObject<any>;
```

The resource for which the deletion was called.

#### status

```ts
status: CONFIRMED;
```

What exactly this event represents. 'CONFIRMED' when the scaling is selected by the user.
For now only 'CONFIRMED' is sent.

#### Defined in

[frontend/src/redux/headlampEventSlice.ts:115](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/redux/headlampEventSlice.ts#L115)

***

### type

```ts
type: SCALE_RESOURCE;
```

#### Defined in

[frontend/src/redux/headlampEventSlice.ts:114](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/redux/headlampEventSlice.ts#L114)
