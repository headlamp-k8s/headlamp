import { styled } from '@mui/material/styles';
import SimpleTable, { SimpleTableProps } from './SimpleTable';

const PREFIX = 'InnerTable';

const classes = {
  root: `${PREFIX}-root`,
};

const StyledSimpleTable = styled(SimpleTable)({
  [`&.${classes.root}`]: {
    border: 'none',
    '& .MuiTableCell-head': {
      background: 'none',
    },
  },
});

export default function InnerTable(props: SimpleTableProps) {
  return <StyledSimpleTable className={classes.root} {...props} />;
}
