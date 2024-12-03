# Interface: PodAttachEvent

Event fired when attaching to a pod.

## Properties

### data

```ts
data: object;
```

#### resource?

```ts
optional resource: Pod;
```

The resource for which the terminal was opened (currently this only happens for Pod instances).

#### status

```ts
status: OPENED | CLOSED;
```

What exactly this event represents. 'OPEN' when the attach dialog is opened. 'CLOSED' when it
is closed.

#### Defined in

[frontend/src/redux/headlampEventSlice.ts:178](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/redux/headlampEventSlice.ts#L178)

***

### type

```ts
type: POD_ATTACH;
```

#### Defined in

[frontend/src/redux/headlampEventSlice.ts:177](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/redux/headlampEventSlice.ts#L177)
