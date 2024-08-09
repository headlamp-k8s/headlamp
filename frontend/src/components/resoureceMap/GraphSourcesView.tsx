import { Icon } from '@iconify/react';
import { Box, Checkbox, FormLabel } from '@mui/material';
import { TreeItem, TreeView } from '@mui/x-tree-view';
import { GraphSource } from './GraphModel';

function GraphSourceView({
  source,
  selection,
  toggleSelection,
}: {
  source: GraphSource;
  selection: Set<string>;
  toggleSelection: (source: GraphSource) => void;
}) {
  const isSelected = (source: GraphSource): boolean =>
    'sources' in source ? source.sources.every(s => isSelected(s)) : selection.has(source.id);
  const isChecked = isSelected(source);
  const intermediate = 'sources' in source && source.sources.some(s => isSelected(s)) && !isChecked;

  const check = (
    <>
      <Checkbox
        checked={isChecked}
        indeterminate={intermediate}
        onClick={e => {
          e.stopPropagation();
          toggleSelection(source);
        }}
      />
      <FormLabel>{source.label}</FormLabel>
    </>
  );

  if (!('sources' in source)) {
    return <TreeItem defaultChecked nodeId={source.id} label={check} />;
  }

  return (
    <TreeItem
      nodeId={source.id}
      label={check}
      expandIcon={<Icon icon="mdi:chevron-down" />}
      collapseIcon={<Icon icon="mdi:chevron-up" />}
    >
      {source.sources?.map(source => (
        <GraphSourceView
          source={source}
          selection={selection}
          toggleSelection={toggleSelection}
          key={source.id}
        />
      ))}
    </TreeItem>
  );
}

export function GraphSourcesView({
  sources,
  selectedSources,
  toggleSource,
}: {
  sources: GraphSource[];
  selectedSources: Set<string>;
  toggleSource: (source: GraphSource) => void;
}) {
  return (
    <Box>
      <FormLabel id="showing-label">Showing</FormLabel>

      <TreeView sx={{ display: 'flex' }}>
        {sources.map((source, index) => (
          <GraphSourceView
            source={source}
            selection={selectedSources}
            toggleSelection={toggleSource}
            key={index}
          />
        ))}
      </TreeView>
    </Box>
  );
}
