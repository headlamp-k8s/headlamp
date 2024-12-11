# Interface: LogsEvent

Event fired when viewing pod logs.

## Properties

### data

```ts
data: object;
```

#### resource?

```ts
optional resource: KubeObject<any>;
```

The resource for which the terminal was opened (currently this only happens for Pod instances).

#### status

```ts
status: OPENED | CLOSED;
```

What exactly this event represents. 'OPEN' when the logs dialog is opened. 'CLOSED' when it
is closed.

#### Defined in

[frontend/src/redux/headlampEventSlice.ts:145](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/redux/headlampEventSlice.ts#L145)

***

### type

```ts
type: LOGS;
```

#### Defined in

[frontend/src/redux/headlampEventSlice.ts:144](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/redux/headlampEventSlice.ts#L144)
