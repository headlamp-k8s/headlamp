import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
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
