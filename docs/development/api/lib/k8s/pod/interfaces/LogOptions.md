# Interface: LogOptions

## Properties

### follow?

```ts
optional follow: boolean;
```

Whether to follow the log stream

#### Defined in

[frontend/src/lib/k8s/pod.ts:58](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/pod.ts#L58)

***

### onReconnectStop()?

```ts
optional onReconnectStop: () => void;
```

Callback to be called when the reconnection attempts stop

#### Returns

`void`

#### Defined in

[frontend/src/lib/k8s/pod.ts:60](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/pod.ts#L60)

***

### showPrevious?

```ts
optional showPrevious: boolean;
```

Whether to show the logs from previous runs of the container (only for restarted containers)

#### Defined in

[frontend/src/lib/k8s/pod.ts:54](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/pod.ts#L54)

***

### showTimestamps?

```ts
optional showTimestamps: boolean;
```

Whether to show the timestamps in the logs

#### Defined in

[frontend/src/lib/k8s/pod.ts:56](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/pod.ts#L56)

***

### tailLines?

```ts
optional tailLines: number;
```

The number of lines to display from the end side of the log

#### Defined in

[frontend/src/lib/k8s/pod.ts:52](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/pod.ts#L52)
