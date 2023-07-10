import { makeStyles } from '@material-ui/core';
import SimpleTable, { SimpleTableProps } from './SimpleTable';

const useStyles = makeStyles({
  root: {
    border: 'none',
    '& .MuiTableCell-head': {
      background: 'none',
    },
  },
});

export default function InnerTable(props: SimpleTableProps) {
  const classes = useStyles();

  return <SimpleTable className={classes.root} {...props} />;
}
