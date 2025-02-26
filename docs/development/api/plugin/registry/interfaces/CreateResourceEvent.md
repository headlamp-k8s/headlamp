# Interface: CreateResourceEvent

Event fired when creating a resource.

## Properties

### data

```ts
data: object;
```

#### status

```ts
status: CONFIRMED;
```

What exactly this event represents. 'CONFIRMED' when the user chooses to apply the new resource.
For now only 'CONFIRMED' is sent.

#### Defined in

[frontend/src/redux/headlampEventSlice.ts:193](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/redux/headlampEventSlice.ts#L193)

***

### type

```ts
type: CREATE_RESOURCE;
```

#### Defined in

[frontend/src/redux/headlampEventSlice.ts:192](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/redux/headlampEventSlice.ts#L192)
