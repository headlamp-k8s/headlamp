# Function: registerAppLogo()

```ts
function registerAppLogo(logo: AppLogoType): void
```

Add a logo for Headlamp to use instead of the default one.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `logo` | [`AppLogoType`](../type-aliases/AppLogoType.md) | is a React Component that takes two required props `logoType` which is a constant string literal that accepts either of the two values `small` or `large` depending on whether the sidebar is in shrink or expanded state so that you can change your logo from small to large and the other optional prop is the `themeName` which is a string with two values 'light' and 'dark' base on which theme is selected. |

## Returns

`void`

## Example

```tsx
import { registerAppLogo } from '@kinvolk/headlamp-plugin/lib';

registerAppLogo(<p>my logo</p>)
```

More complete logo example in plugins/examples/change-logo:

## See

[Change Logo Example](http://github.com/kinvolk/headlamp/plugins/examples/change-logo/)

## Defined in

[frontend/src/plugin/registry.tsx:550](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/plugin/registry.tsx#L550)
