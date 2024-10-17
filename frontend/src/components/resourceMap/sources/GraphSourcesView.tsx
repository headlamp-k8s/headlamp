import { Icon } from '@iconify/react';
import {
  Badge,
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  Drawer,
  Theme,
  Typography,
} from '@mui/material';
import { TreeItem, TreeView } from '@mui/x-tree-view';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GraphSource } from '../graph/graphModel';

function GraphSourceView({
  source,
  sourceData,
  selection,
  toggleSelection,
}: {
  source: GraphSource;
  sourceData: Map<string, any>;
  selection: Set<string>;
  toggleSelection: (source: GraphSource) => void;
}) {
  const hasChildren = 'sources' in source;
  const isSelected = (source: GraphSource): boolean =>
    'sources' in source ? source.sources.every(s => isSelected(s)) : selection.has(source.id);
  const isChecked = isSelected(source);
  const intermediate = 'sources' in source && source.sources.some(s => isSelected(s)) && !isChecked;

  const data = sourceData.get(source.id);

  const check = (
    <Box display="flex" alignItems="center" py={0.75} gap={0.5}>
      <Box mr={1} display="flex">
        <Badge badgeContent={isChecked ? data?.nodes?.length : undefined} overlap="circular">
          <Box width={hasChildren ? '24px' : '30px'} height={hasChildren ? '24px' : '30px'}>
            {source.icon}
          </Box>
        </Badge>
      </Box>
      <Typography variant="subtitle2">{source.label}</Typography>
      {!('sources' in source) && isChecked && !data && <CircularProgress />}
      <Checkbox
        sx={() => ({ marginLeft: 'auto' })}
        checked={isChecked}
        indeterminate={intermediate}
        onClick={e => {
          e.stopPropagation();
          toggleSelection(source);
        }}
      />
    </Box>
  );

  if (!('sources' in source)) {
    return (
      <TreeItem
        defaultChecked
        nodeId={source.id}
        label={check}
        onClick={() => {
          toggleSelection(source);
        }}
        ContentProps={{
          // @ts-expect-error
          sx: (theme: Theme) => ({
            background: 'none',
            backgroundColor: 'transparent',
            cursor: 'unset',
            borderRadius: '8px',
            '&.Mui-selected': {
              backgroundColor: 'transparent',
              color: theme.palette.text.primary,
            },
            '&.Mui-selected:hover': {
              backgroundColor: 'transparent',
            },
            '&.Mui-selected.Mui-focused': {
              backgroundColor: 'transparent',
              color: theme.palette.text.primary,
            },
          }),
        }}
      />
    );
  }

  return (
    <TreeItem
      nodeId={source.id}
      label={check}
      sx={{ marginBottom: '8px' }}
      ContentProps={{
        // @ts-expect-error
        sx: (theme: Theme) => ({
          borderRadius: '8px',
          background: theme.palette.action.hover,
          '&.Mui-selected': {
            background: theme.palette.action.hover,
            color: theme.palette.text.primary,
          },
          '&.Mui-selected.Mui-focused': {
            background: theme.palette.action.hover,
            color: theme.palette.text.primary,
          },
        }),
      }}
      expandIcon={
        <Icon icon="mdi:chevron-right" width={18} height={18} style={{ flexShrink: 0 }} />
      }
      collapseIcon={
        <Icon icon="mdi:chevron-down" width={18} height={18} style={{ flexShrink: 0 }} />
      }
    >
      {source.sources?.map(source => (
        <GraphSourceView
          source={source}
          selection={selection}
          toggleSelection={toggleSelection}
          key={source.id}
          sourceData={sourceData}
        />
      ))}
    </TreeItem>
  );
}

export const GraphSourcesView = memo(
  ({
    sources,
    sourceData,
    selectedSources,
    toggleSource,
  }: {
    sources: GraphSource[];
    sourceData: Map<string, any>;
    selectedSources: Set<string>;
    toggleSource: (source: GraphSource) => void;
  }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const selected = sources.filter(source => {
      const isSelected = selectedSources.has(source.id);
      return 'sources' in source
        ? source.sources.some(it => selectedSources.has(it.id))
        : isSelected;
    });
    const selectedText =
      selected.length > 2
        ? `${selected[0].label}, ${selected[1].label}, +${selected.length - 2}`
        : selected.map(it => it.label).join(', ');

    return (
      <>
        <Chip
          label={t('Showing: {{ name }}', { name: selectedText })}
          color="primary"
          variant={'filled'}
          onClick={() => setIsOpen(true)}
          sx={{
            lineHeight: '1',
          }}
        />
        <Drawer
          open={isOpen}
          onClose={() => setIsOpen(false)}
          PaperProps={{
            sx: {
              marginTop: '64px',
            },
          }}
        >
          <TreeView sx={{ width: '300px', padding: 2 }}>
            <Typography variant="h5" mb={1}>
              {t('Resources')}
            </Typography>
            {sources.map((source, index) => (
              <GraphSourceView
                source={source}
                selection={selectedSources}
                toggleSelection={toggleSource}
                key={index}
                sourceData={sourceData}
              />
            ))}
          </TreeView>
        </Drawer>
      </>
    );
  }
);
