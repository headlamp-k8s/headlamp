# Interface: TerminalEvent

Event fired when using the terminal.

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

What exactly this event represents. 'OPEN' when the terminal is opened. 'CLOSED' when it
is closed.

#### Defined in

[frontend/src/redux/headlampEventSlice.ts:163](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/redux/headlampEventSlice.ts#L163)

***

### type

```ts
type: TERMINAL;
```

#### Defined in

[frontend/src/redux/headlampEventSlice.ts:162](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/redux/headlampEventSlice.ts#L162)
