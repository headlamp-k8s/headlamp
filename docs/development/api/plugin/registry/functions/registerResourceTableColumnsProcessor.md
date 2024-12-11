# Function: registerResourceTableColumnsProcessor()

```ts
function registerResourceTableColumnsProcessor(processor: TableColumnsProcessor | <T>(args: object) => (ColumnType | ResourceTableColumn<T>)[]): void
```

Add a processor for the resource table columns. Allowing the modification of what tables show.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `processor` | `TableColumnsProcessor` \| \<`T`\>(`args`: `object`) => (`ColumnType` \| `ResourceTableColumn`\<`T`\>)[] | The processor ID and function. See #TableColumnsProcessor. |

## Returns

`void`

## Example

```tsx
import { registerResourceTableColumnsProcessor } from '@kinvolk/headlamp-plugin/lib';

// Processor that adds a column to show how many init containers pods have (in the default pods' list table).
registerResourceTableColumnsProcessor(function ageRemover({ id, columns }) {
  if (id === 'headlamp-pods') {
    columns.push({
      label: 'Init Containers',
      // return plain value to allow filtering and sorting
      getValue: (pod: Pod) => {
        return pod.spec.initContainers.length;
      }
      // (optional) customise how the cell value is rendered
      render: (pod: Pod) => <div style={{ color: "red" }}>{pod.spec.initContainers.length}</div>
    });
  }

  return columns;
});
```

## Defined in

[frontend/src/plugin/registry.tsx:408](https://github.com/headlamp-k8s/headlamp/blob/2481a1c9f2b4a69a9320466e7a455215b14b97b0/frontend/src/plugin/registry.tsx#L408)
