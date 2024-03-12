import SimpleTable, { SimpleTableProps } from './SimpleTable';

export default function InnerTable(props: SimpleTableProps) {
  return (
    <SimpleTable
      sx={{
        border: 'none',
        '& .MuiTableCell-head': {
          background: 'none',
        },
      }}
      {...props}
    />
  );
}
