# Function: registerPluginSettings()

```ts
function registerPluginSettings(
   name: string, 
   component: PluginSettingsComponentType, 
   displaySaveButton: boolean): void
```

Register a plugin settings component.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `name` | `string` | `undefined` | The name of the plugin. |
| `component` | [`PluginSettingsComponentType`](../type-aliases/PluginSettingsComponentType.md) | `undefined` | The component to use for the settings. |
| `displaySaveButton` | `boolean` | `false` | Whether to display the save button. |

## Returns

`void`

void

## Example

```tsx
import { registerPluginSettings } from '@kinvolk/headlamp-plugin/lib';
import { TextField } from '@mui/material';

function MyPluginSettingsComponent(props: PluginSettingsDetailsProps) {
  const { data, onDataChange } = props;

  function onChange(value: string) {
    if (onDataChange) {
      onDataChange({ works: value });
    }
  }

  return (
    <TextField
      value={data?.works || ''}
      onChange={e => onChange(e.target.value)}
      label="Normal Input"
      variant="outlined"
      fullWidth
    />
  );
}

const displaySaveButton = true;
// Register a plugin settings component.
registerPluginSettings('my-plugin', MyPluginSettingsComponent, displaySaveButton);
```

More complete plugin settings example in plugins/examples/change-logo:

## See

[Change Logo Example](https://github.com/headlamp-k8s/headlamp/tree/main/plugins/examples/change-logo)

## Defined in

[frontend/src/plugin/registry.tsx:679](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/plugin/registry.tsx#L679)
