import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import React from 'react';
import { ResourceTableColumn } from './ResourceTable';

interface ColumnsPopupProps {
  columns: ResourceTableColumn[];
  onToggleColumn: (cols: ResourceTableColumn[]) => void;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

export default function ColumnsPopup(props: ColumnsPopupProps) {
  const { columns, onToggleColumn, onClose, anchorEl } = props;
  const [currentColumns, setColumnsChanged] = React.useState(columns);

  function handleClose() {
    onClose();
  }

  React.useEffect(() => {
    setColumnsChanged(columns);
  }, [columns]);

  function handleToggleColumn(index: number) {
    const newColumns = currentColumns.map((c, idx) => {
      if (idx === index) {
        return {
          ...c,
          show: !(c.show ?? true),
        };
      }

      return c;
    });

    onToggleColumn(newColumns);
  }

  return (
    <Popover
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <List>
        {currentColumns.map((column, index) => {
          const labelId = `column-index-${index}`;

          return (
            <ListItem key={labelId} dense button onClick={() => handleToggleColumn(index)}>
              <Box>
                <Checkbox
                  edge="start"
                  checked={column.show || column.show === undefined}
                  tabIndex={-1}
                  disableRipple
                  color="default"
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </Box>
              <ListItemText id={labelId + '-label'} primary={column.label} />
            </ListItem>
          );
        })}
      </List>
    </Popover>
  );
}
