# Interface: LabelSelector

## Properties

### matchExpressions?

```ts
optional matchExpressions: object[];
```

#### key

```ts
key: string;
```

#### operator

```ts
operator: string;
```

#### values

```ts
values: string[];
```

#### Defined in

[frontend/src/lib/k8s/cluster.ts:489](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L489)

***

### matchLabels?

```ts
optional matchLabels: object;
```

#### Index Signature

 \[`key`: `string`\]: `string`

#### Defined in

[frontend/src/lib/k8s/cluster.ts:494](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/cluster.ts#L494)
