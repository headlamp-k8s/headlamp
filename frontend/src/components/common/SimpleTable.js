import squareIcon from '@iconify/icons-mdi/square';
import { InlineIcon } from '@iconify/react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';
import Empty from './EmptyContent';
import { NameLabel, ValueLabel } from './Label';
import Loader from './Loader';

const useTableStyle = makeStyles(theme => ({
  headerCell: {
    fontWeight: 'bold',
    paddingBottom: theme.spacing(.5),
  }
}));

export default function SimpleTable(props) {
  const {columns, data, filterFunction=null} = props;
  const [page, setPage] = React.useState(0);
  const rowsPerPageOptions = props.rowsPerPage || [5, 10, 50];
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptions[0]);
  const classes = useTableStyle();

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
  [data])

  function getPagedRows() {
    const startIndex = page * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }

  if (data === null) {
    return <Loader />;
  }

  let filteredData = data;

  if (filterFunction) {
    filteredData = data.filter(filterFunction);
  }

  return (
    (!data || data.length === 0) ?
      <Empty>{props.emptyMessage ? props.emptyMessage : 'No data to be shown.'}</Empty>
    :
      <React.Fragment>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(({label, cellProps={}}, i) =>
                <TableCell
                  key={`tabletitle_${i}`}
                  className={classes.headerCell}
                  {...cellProps}
                >
                  {label}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
          {filteredData.length > 0 ?
            getPagedRows().map((row, i) =>
              <TableRow key={i}>
                {columns.map(({datum, getter}, i) =>
                  <TableCell key={`cell_${i}`}>
                    {i === 0 && row.color &&
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
            )
          :
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Empty>No data matching the filter criteria.</Empty>
              </TableCell>
            </TableRow>
        }
          </TableBody>
        </Table>
        {filteredData.length > rowsPerPageOptions[0] &&
          <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={filteredData.length}
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

const useStyles = makeStyles(theme => ({
  metadataCell: {
    border: 'none',
    width: '100%',
    verticalAlign: 'top',
  },
  metadataNameCell: {
    border: 'none',
    textAlign: 'left',
    maxWidth: '50%',
    minWidth: '10rem',
    verticalAlign: 'top',
  },
}));

export function NameValueTable(props) {
  const classes = useStyles();
  const { rows } = props;

  return (
    <Table
      size="small"
    >
      <TableBody>
        {rows.map(({name, value=null, nameComponent=null, valueComponent=null, hide=false}, i) => {
          if (hide)
            return null;
          return (
            <TableRow key={i}>
              <TableCell className={classes.metadataNameCell}>
                {nameComponent ?
                  nameComponent
                  :
                  <NameLabel>
                    {name}
                  </NameLabel>
                }
              </TableCell>
              <TableCell scope="row" className={classes.metadataCell}>
                {valueComponent ?
                  valueComponent
                :
                  <ValueLabel>{value}</ValueLabel>
                }
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  );
}