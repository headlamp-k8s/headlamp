# Interface: EventListEvent

Event fired when kubernetes events are loaded (for a resource or not).

## Properties

### data

```ts
data: object;
```

#### events

```ts
events: Event[];
```

The list of events that were loaded.

#### resource?

```ts
optional resource: KubeObject<any>;
```

The resource for which the events were loaded.

#### Defined in

[frontend/src/redux/headlampEventSlice.ts:270](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/redux/headlampEventSlice.ts#L270)

***

### type

```ts
type: OBJECT_EVENTS;
```

#### Defined in

[frontend/src/redux/headlampEventSlice.ts:269](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/redux/headlampEventSlice.ts#L269)
