# Function: registerAppBarAction()

```ts
function registerAppBarAction(headerAction: AppBarAction | AppBarActionsProcessor | AppBarActionProcessorType | AppBarActionType): void
```

Add a component into the app bar (at the top of the app).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `headerAction` | `AppBarAction` \| `AppBarActionsProcessor` \| [`AppBarActionProcessorType`](../type-aliases/AppBarActionProcessorType.md) \| `AppBarActionType` | The action (link) to put in the app bar. |

## Returns

`void`

## Example

```tsx
import { registerAppBarAction } from '@kinvolk/headlamp-plugin/lib';
import { Button } from '@mui/material';

function ConsoleLogger() {
  return (
    <Button
      onClick={() => {
        console.log('Hello from ConsoleLogger!')
      }}
    >
      Print Log
    </Button>
  );
}

registerAppBarAction(ConsoleLogger);
```

## Defined in

[frontend/src/plugin/registry.tsx:450](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/plugin/registry.tsx#L450)
