# Interface: PluginSettingsDetailsProps

Props for PluginSettingsDetailsProps component.

## Properties

### data?

```ts
readonly optional data: object;
```

Data object representing the current state/configuration.
readonly - The data object is readonly and cannot be modified.

#### Index Signature

 \[`key`: `string`\]: `any`

#### Defined in

[frontend/src/plugin/pluginsSlice.ts:18](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/plugin/pluginsSlice.ts#L18)

***

### onDataChange()?

```ts
optional onDataChange: (data: object) => void;
```

Callback function to be triggered when there's a change in data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | \{\} | The updated data object. |

#### Returns

`void`

#### Defined in

[frontend/src/plugin/pluginsSlice.ts:12](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/plugin/pluginsSlice.ts#L12)
