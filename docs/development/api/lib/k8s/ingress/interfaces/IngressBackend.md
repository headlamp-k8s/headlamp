# Interface: IngressBackend

## Properties

### resource?

```ts
optional resource: object;
```

#### apiVersion

```ts
apiVersion: string;
```

#### kind

```ts
kind: string;
```

#### name

```ts
name: string;
```

#### Defined in

[frontend/src/lib/k8s/ingress.ts:37](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/ingress.ts#L37)

***

### service?

```ts
optional service: object;
```

#### name

```ts
name: string;
```

#### port

```ts
port: object;
```

##### port.name?

```ts
optional name: string;
```

##### port.number?

```ts
optional number: number;
```

#### Defined in

[frontend/src/lib/k8s/ingress.ts:30](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/lib/k8s/ingress.ts#L30)
