import refreshIcon from '@iconify/icons-mdi/refresh';
import squareIcon from '@iconify/icons-mdi/square';
import { Icon, InlineIcon } from '@iconify/react';
import { Button } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';
import Empty from './EmptyContent';
import { ValueLabel } from './Label';
import Loader from './Loader';

const useTableStyle = makeStyles(theme => ({
  headerCell: {
    fontWeight: 'bold',
    paddingBottom: theme.spacing(.5),
  },
  table: {
    '& .MuiTableCell-root': {
      paddingLeft: '0',
    },
    '& .MuiTableBody-root': {
      '& .MuiTableRow-root:last-child': {
        '& .MuiTableCell-root': {
          borderBottom: 'none',
        },
      }
    },
    '& .MuiTableCell-head': {
      color: theme.palette.tables.headerText,
    }
  }
}));

interface SimpleTableColumn {
  label: string;
  cellProps?: {
    [propName: string]: any;
  };
}

interface SimpleTableDatumColumn extends SimpleTableColumn {
  datum: string;
}

interface SimpleTableGetterColumn extends SimpleTableColumn {
  getter: (...args: any[]) => void;
}

export interface SimpleTableProps {
  columns: (SimpleTableGetterColumn | SimpleTableDatumColumn)[];
  data: {
    [dataProp: string]: any;
    [dataProp: number]: any;
  } | null;
  filterFunction?: (...args: any[]) => boolean;
  rowsPerPage?: number[];
  emptyMessage?: string;
  errorMessage?: string | null;
}

export default function SimpleTable(props: SimpleTableProps) {
  const {
    columns,
    data,
    filterFunction = null,
    emptyMessage = null,
    errorMessage = null,
  } = props;
  const [page, setPage] = React.useState(0);
  const [currentData, setCurrentData] = React.useState(data);
  const rowsPerPageOptions = props.rowsPerPage || [5, 10, 50];
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptions[0]);
  const classes = useTableStyle();

  function handleChangePage(_event: any, newPage: number) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event: any) {
    setRowsPerPage(+event.target.value);
    setPage(0);
  }

  React.useEffect(() => {
    if (currentData === data) {
      if (page !== 0) {
        setPage(0);
      }
      return;
    }

    // If the currentData is not up to date and we are in the first page, then update
    // it directly. Otherwise it will require user's intervention.
    if ((!currentData || currentData.length === 0) || page === 0) {
      setCurrentData(data);
    }
  },
  // eslint-disable-next-line
  [data, currentData]);

  function getPagedRows() {
    const startIndex = page * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }

  if (currentData === null) {
    if (!!errorMessage) {
      return (
        <Empty color="error">{errorMessage}</Empty>
      );
    }

    return <Loader />;
  }

  let filteredData = currentData;

  if (filterFunction) {
    filteredData = currentData.filter(filterFunction);
  }

  return (
    (!currentData || currentData.length === 0) ?
      <Empty>{emptyMessage || 'No data to be shown.'}</Empty>
      :
      <React.Fragment>
        { // Show a refresh button if the data is not up to date, so we allow the user to keep
          // reading the current data without "losing" it or being sent to the first page
          (currentData !== data) &&
          <Box textAlign="center" p={2}>
            <Button
              variant="contained"
              startIcon={<Icon icon={refreshIcon} /> }
              onClick={() => { setCurrentData(data); }}
            >
              Refresh
            </Button>
          </Box>
        }
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {columns.map(({label, cellProps = {}}, i) => {
                const {className = '', ...otherProps} = cellProps;
                return (
                  <TableCell
                    key={`tabletitle_${i}`}
                    className={classes.headerCell + ' ' + className}
                    {...otherProps}
                  >
                    {label}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ?
              getPagedRows().map((row: any, i: number) =>
                <TableRow key={i}>
                  {columns.map((col, i) =>
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
                      { ('datum' in col) ? row[col.datum] : col.getter(row) }
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
    width: '100%',
    verticalAlign: 'top',
  },
  metadataNameCell: {
    textAlign: 'left',
    maxWidth: '50%',
    minWidth: '10rem',
    verticalAlign: 'top',
    paddingLeft: '0',
    paddingRight: '0',
    color: theme.palette.text.secondary,
  },
  table: {
    '& .MuiTableBody-root': {
      '& .MuiTableRow-root:last-child': {
        '& .MuiTableCell-root': {
          borderBottom: 'none',
        },
      }
    }
  }
}));

export interface NameValueTableRow {
  name: string | JSX.Element;
  value?: string | JSX.Element;
  hide?: boolean;
}

interface NameValueTableProps {
  rows: NameValueTableRow[];
}

export function NameValueTable(props: NameValueTableProps) {
  const classes = useStyles();
  const { rows } = props;

  return (
    <Table className={classes.table}>
      <TableBody>
        {rows.map(({name, value, hide = false}, i) => {
          if (hide)
            return null;
          return (
            <TableRow key={i}>
              <TableCell className={classes.metadataNameCell}>
                {name}
              </TableCell>
              <TableCell scope="row" className={classes.metadataCell}>
                {(typeof value === 'string') ?
                  <ValueLabel>{value}</ValueLabel>
                  :
                  value
                }
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
