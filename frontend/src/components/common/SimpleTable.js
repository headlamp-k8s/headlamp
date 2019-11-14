import squareIcon from '@iconify/icons-mdi/square';
import { InlineIcon } from '@iconify/react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';
import Empty from './EmptyContent';

export default function SimpleTable(props) {
  const {columns} = props;
  const [page, setPage] = React.useState(0);
  const rowsPerPageOptions = props.rowsPerPage || [5, 10, 50];
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptions[0]);

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }

  React.useEffect(() => {
    setPage(0);
  },
  [props.data])

  function getPagedRows() {
    const startIndex = page * rowsPerPage;
    return props.data.slice(startIndex, startIndex + rowsPerPage);
  }

  return (
    (!props.data || props.data.length == 0) ?
      <Empty>{props.emptyMessage ? props.emptyMessage : 'No data to be shown.'}</Empty>
    :
      <React.Fragment>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(({label}, i) =>
                <TableCell key={`tabletitle_${i}`}>{label}</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
          {props.data &&
           getPagedRows().map((row, i) =>
            <TableRow key={i}>
              {columns.map(({datum, getter}, i) =>
                <TableCell key={`cell_${i}`}>
                  {i == 0 && row.color &&
                    <React.Fragment>
                      <InlineIcon
                        icon={squareIcon}
                        color={row.color}
                        height="15"
                        width="15"
                      />
                      &nbsp;
                    </React.Fragment>
                  }
                  { datum ? row[datum] : getter(row) }
                </TableCell>
              )}
            </TableRow>
          )}
          </TableBody>
        </Table>
        {props.data.length > rowsPerPageOptions[0] &&
          <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={props.data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'previous page',
            }}
            nextIconButtonProps={{
              'aria-label': 'next page',
            }}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        }
      </React.Fragment>
  );
}