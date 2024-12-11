# Interface: KubeCondition

## Properties

### lastProbeTime

```ts
lastProbeTime: Time;
```

Last time we probed the condition.

#### Defined in

[frontend/src/lib/k8s/cluster.ts:151](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L151)

***

### lastTransitionTime?

```ts
optional lastTransitionTime: Time;
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:152](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L152)

***

### lastUpdateTime?

```ts
optional lastUpdateTime: Time;
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:153](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L153)

***

### message?

```ts
optional message: string;
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:154](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L154)

***

### reason?

```ts
optional reason: string;
```

Unique, one-word, CamelCase reason for the condition's last transition.

#### Defined in

[frontend/src/lib/k8s/cluster.ts:156](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L156)

***

### status

```ts
status: string;
```

Status of the condition, one of True, False, Unknown.

#### Defined in

[frontend/src/lib/k8s/cluster.ts:158](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L158)

***

### type

```ts
type: string;
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:159](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L159)
