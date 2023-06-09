import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import { SimpleTableProps } from './SimpleTable';

type SimpleTableColumn = SimpleTableProps['columns'][number];

interface ColumnsPopupProps {
  columns: SimpleTableColumn[];
  onToggleColumn: (column: SimpleTableColumn) => void;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

export default function ColumnsPopup(props: ColumnsPopupProps) {
  // const { t } = useTranslation('frequent');
  const { columns, onToggleColumn, onClose, anchorEl } = props;

  function handleClose() {
    onClose();
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
      <Box p={2}>
        <List>
          {columns.map((column, index) => {
            const labelId = `column-index-${index}`;

            return (
              <ListItem
                key={labelId}
                role={undefined}
                dense
                button
                onClick={() => onToggleColumn(column)}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={!column}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId + '-label'} primary={column.label} />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Popover>
  );
}
