# Interface: AppLogoProps

## Indexable

 \[`key`: `string`\]: `any`

## Properties

### className?

```ts
optional className: string;
```

A class to use on your SVG.

#### Defined in

[frontend/src/components/App/AppLogo.tsx:19](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/components/App/AppLogo.tsx#L19)

***

### logoType?

```ts
optional logoType: "small" | "large";
```

The size of the logo. 'small' for in mobile view, and 'large' for tablet and desktop sizes. By default the 'large' is used.

#### Defined in

[frontend/src/components/App/AppLogo.tsx:15](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/components/App/AppLogo.tsx#L15)

***

### sx?

```ts
optional sx: SxProps<Theme>;
```

SxProps to use on your SVG.

#### Defined in

[frontend/src/components/App/AppLogo.tsx:21](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/components/App/AppLogo.tsx#L21)

***

### themeName?

```ts
optional themeName: "light" | "dark";
```

User selected theme. By default it checks which is is active.

#### Defined in

[frontend/src/components/App/AppLogo.tsx:17](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/components/App/AppLogo.tsx#L17)
