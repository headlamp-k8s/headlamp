# Interface: HeadlampEvent\<EventType\>

Represents a Headlamp event. It can be one of the default events or a custom event.

## Extended by

- [`DeleteResourceEvent`](DeleteResourceEvent.md)

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `EventType` | `HeadlampEventType` \| `string` |

## Properties

### data?

```ts
optional data: unknown;
```

#### Defined in

[frontend/src/redux/headlampEventSlice.ts:69](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/redux/headlampEventSlice.ts#L69)

***

### type

```ts
type: EventType;
```

#### Defined in

[frontend/src/redux/headlampEventSlice.ts:68](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/redux/headlampEventSlice.ts#L68)
