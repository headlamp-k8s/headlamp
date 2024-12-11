# Interface: RestartResourceEvent

Event fired when restarting a resource.

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

What exactly this event represents. 'CONFIRMED' when the restart is selected by the user.
For now only 'CONFIRMED' is sent.

#### Defined in

[frontend/src/redux/headlampEventSlice.ts:130](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/redux/headlampEventSlice.ts#L130)

***

### type

```ts
type: RESTART_RESOURCE;
```

#### Defined in

[frontend/src/redux/headlampEventSlice.ts:129](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/redux/headlampEventSlice.ts#L129)
