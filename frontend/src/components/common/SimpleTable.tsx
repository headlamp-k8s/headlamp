import { Icon, InlineIcon } from '@iconify/react';
import { Button, Grid, GridProps, IconButton, Paper, TableContainer } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import clsx from 'clsx';
import React from 'react';
import { useTranslation } from 'react-i18next';
import helpers from '../../helpers';
import { useURLState } from '../../lib/util';
import { useSettings } from '../App/Settings/hook';
import Empty from './EmptyContent';
import { ValueLabel } from './Label';
import Loader from './Loader';

const useTableStyle = makeStyles(theme => ({
  headerCell: {
    fontWeight: 'bold',
    paddingBottom: theme.spacing(0.5),
  },
  sortCell: {
    whiteSpace: 'nowrap',
  },
  table: {
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      overflowX: 'auto', // make it responsive
    },
    '& .MuiTableCell-root': {
      padding: '8px 24px 7px 16px',
    },
    '& .MuiTableBody-root': {
      '& .MuiTableRow-root:last-child': {
        '& .MuiTableCell-root': {
          borderBottom: 'none',
        },
      },
    },
    '& .MuiTableCell-head': {
      color: theme.palette.tables.headerText,
      backgroundColor: '#FAF9F8',
      // fontSize: '1.1rem',
    },
  },
}));

type sortFunction = (arg1: any, arg2: any) => number;
type getterFunction = (arg: any) => any;

interface SimpleTableColumn {
  label: string;
  cellProps?: {
    [propName: string]: any;
  };
  sort?: sortFunction | getterFunction | boolean;
}

interface SimpleTableDatumColumn extends SimpleTableColumn {
  datum: string;
}

interface SimpleTableGetterColumn extends SimpleTableColumn {
  getter: (...args: any[]) => void;
}

export interface SimpleTableProps {
  columns: (SimpleTableGetterColumn | SimpleTableDatumColumn)[];
  data:
    | {
        [dataProp: string]: any;
        [dataProp: number]: any;
      }[]
    | null;
  filterFunction?: ((...args: any[]) => boolean) | null;
  rowsPerPage?: number[];
  emptyMessage?: string;
  errorMessage?: string | null;
  defaultSortingColumn?: number;
  noTableHeader?: boolean;
  /** Whether to reflect the page/perPage properties in the URL.
   * If assigned to a string, it will be the prefix for the page/perPage parameters.
   * If true or '', it'll reflect the parameters without a prefix.
   * By default, no parameters are reflected in the URL. */
  reflectInURL?: string | boolean;
  /** The page number to show by default (by default it's the first page). */
  page?: number;
  /** Whether to show the pagination component */
  showPagination?: boolean;
}

interface ColumnSortButtonProps {
  isDefaultSorted: boolean;
  isIncreasingOrder: boolean;
  clickHandler: (isIncreasingOrder: boolean) => void;
}

function ColumnSortButtons(props: ColumnSortButtonProps) {
  const { t } = useTranslation('frequent');
  const { isDefaultSorted, isIncreasingOrder, clickHandler } = props;
  return isDefaultSorted ? (
    <IconButton
      aria-label={isIncreasingOrder ? t('frequent|sort up') : t('frequent|sort down')}
      size="small"
      onClick={() => clickHandler(!isIncreasingOrder)}
    >
      <Icon icon={isIncreasingOrder ? 'mdi:menu-up' : 'mdi:menu-down'} />
    </IconButton>
  ) : (
    <IconButton
      aria-label={t('frequent|sort swap')}
      size="small"
      onClick={() => clickHandler(true)}
    >
      <Icon icon="mdi:menu-swap" />
    </IconButton>
  );
}

// Use a zero-indexed "useURLState" hook, so pages are shown in the URL as 1-indexed
// but internally are 0-indexed.
function usePageURLState(
  key: string,
  prefix: string,
  initialPage: number
): ReturnType<typeof useURLState> {
  const [page, setPage] = useURLState(key, { defaultValue: initialPage + 1, prefix });
  const [zeroIndexPage, setZeroIndexPage] = React.useState(page - 1);

  React.useEffect(() => {
    setZeroIndexPage((zeroIndexPage: number) => {
      if (page - 1 !== zeroIndexPage) {
        return page - 1;
      }

      return zeroIndexPage;
    });
  }, [page]);

  React.useEffect(() => {
    setPage(zeroIndexPage + 1);
  }, [zeroIndexPage]);

  return [zeroIndexPage, setZeroIndexPage];
}

export default function SimpleTable(props: SimpleTableProps) {
  const {
    columns,
    data,
    filterFunction = null,
    emptyMessage = null,
    page: initialPage = 0,
    // @todo: This is a workaround due to how the pagination is built by default.
    showPagination = !process.env.UNDER_TEST, // Disable for snapshots: The pagination uses useId so snapshots will fail.
    errorMessage = null,
    defaultSortingColumn,
    noTableHeader = false,
    reflectInURL,
  } = props;
  const shouldReflectInURL = reflectInURL !== undefined && reflectInURL !== false;
  const prefix = reflectInURL === true ? '' : reflectInURL || '';
  const [page, setPage] = usePageURLState(shouldReflectInURL ? 'p' : '', prefix, initialPage);
  const [currentData, setCurrentData] = React.useState(data);
  const [displayData, setDisplayData] = React.useState(data);
  const storeRowsPerPageOptions = useSettings('tableRowsPerPageOptions');
  const rowsPerPageOptions = props.rowsPerPage || storeRowsPerPageOptions;
  const defaultRowsPerPage = React.useMemo(
    () => helpers.getTablesRowsPerPage(rowsPerPageOptions[0]),
    []
  );
  const [rowsPerPage, setRowsPerPage] = useURLState(shouldReflectInURL ? 'perPage' : '', {
    defaultValue: defaultRowsPerPage,
    prefix,
  });
  const classes = useTableStyle();
  const [isIncreasingOrder, setIsIncreasingOrder] = React.useState(
    !defaultSortingColumn || defaultSortingColumn > 0
  );
  // We use a -1 value here if no sorting should be done by default.
  const [sortColIndex, setSortColIndex] = React.useState(
    defaultSortingColumn ? Math.abs(defaultSortingColumn) - 1 : -1
  );
  const { t } = useTranslation('resource');

  function handleChangePage(_event: any, newPage: number) {
    setPage(newPage);
  }

  // Protect against invalid page values
  React.useEffect(() => {
    if (page < 0) {
      setPage(0);
      return;
    }

    if (displayData && page * rowsPerPage > displayData.length) {
      setPage(Math.floor(displayData.length / rowsPerPage));
    }
  }, [page, displayData, rowsPerPage]);

  function handleChangeRowsPerPage(
    event: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>
  ) {
    const numRows = +event.target.value;
    helpers.setTablesRowsPerPage(numRows);
    setRowsPerPage(numRows);
    setPage(0);
  }

  React.useEffect(
    () => {
      if (currentData === data) {
        return;
      }

      // If the currentData is not up to date and we are in the first page, then update
      // it directly. Otherwise it will require user's intervention.
      if (!currentData || currentData.length === 0 || page === 0) {
        setCurrentData(data);
        setDisplayData(getSortData() || data);
      }
    },
    // eslint-disable-next-line
    [data, currentData]
  );

  function defaultSortingFunction(column: SimpleTableDatumColumn | SimpleTableGetterColumn) {
    const sort = column?.sort;
    function defaultSortingReal(item1: any, item2: any) {
      let getterFunc = (column as SimpleTableGetterColumn).getter;
      if (!!sort && typeof sort === 'function') {
        getterFunc = sort;
      }
      // If instead of a getter function, we have a datum, then we use it to fetch the values for
      // comparison.
      const datum = (column as SimpleTableDatumColumn).datum;
      if (!getterFunc && !!datum) {
        getterFunc = (item: any) => item[datum];
      }
      const value1 = getterFunc(item1);
      const value2 = getterFunc(item2);

      let compareValue = 0;
      if (value1 < value2) {
        compareValue = -1;
      } else if (value1 > value2) {
        compareValue = 1;
      }

      return compareValue * (isIncreasingOrder ? 1 : -1);
    }

    return defaultSortingReal;
  }

  function getSortData() {
    if (!data || sortColIndex < 0) {
      return null;
    }
    let applySort = undefined;
    const columnAskingForSort = columns[sortColIndex];
    const sortFunction = columnAskingForSort?.sort;

    if (
      (typeof sortFunction === 'boolean' && sortFunction) ||
      (typeof sortFunction === 'function' && sortFunction.length === 1)
    ) {
      setDisplayData(data.slice().sort(defaultSortingFunction(columnAskingForSort)));
      return;
    }

    if (typeof sortFunction === 'function') {
      applySort = (arg1: any, arg2: any) => {
        const orderChanger = isIncreasingOrder ? 1 : -1;
        return (sortFunction(arg1, arg2) as number) * orderChanger;
      };
      const sortedData = data.slice().sort(applySort);
      return sortedData;
    }
  }

  React.useEffect(
    () => {
      const sortedData = getSortData();
      if (!sortedData) {
        return;
      }
      setDisplayData(sortedData);
    },
    // eslint-disable-next-line
    [sortColIndex, isIncreasingOrder, currentData]
  );

  function getPagedRows() {
    const startIndex = page * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }

  if (displayData === null) {
    if (!!errorMessage) {
      return <Empty color="error">{errorMessage}</Empty>;
    }

    return <Loader title={t('Loading table data')} />;
  }

  let filteredData = displayData;
  if (filterFunction) {
    filteredData = displayData.filter(filterFunction);
  }

  function sortClickHandler(isIncreasingOrder: boolean, index: number) {
    setIsIncreasingOrder(isIncreasingOrder);
    setSortColIndex(index);
  }

  return !currentData || currentData.length === 0 ? (
    <Empty>{emptyMessage || t('No data to be shown.')}</Empty>
  ) : (
    <TableContainer component={Paper}>
      {
        // Show a refresh button if the data is not up to date, so we allow the user to keep
        // reading the current data without "losing" it or being sent to the first page
        currentData !== data && (
          <Box textAlign="center" p={2}>
            <Button
              variant="contained"
              startIcon={<Icon icon="mdi:refresh" />}
              onClick={() => {
                setCurrentData(data);
                setPage(0);
              }}
            >
              {t('frequent|Refresh')}
            </Button>
          </Box>
        )
      }
      <Table className={classes.table} size="small">
        {!noTableHeader && (
          <TableHead>
            <TableRow>
              {columns.map(({ label, cellProps = {}, sort }, i) => {
                const { className = '', ...otherProps } = cellProps;
                return (
                  <TableCell
                    key={`tabletitle_${i}`}
                    className={clsx(classes.headerCell, className, sort ? classes.sortCell : '')}
                    {...otherProps}
                  >
                    {label}
                    {sort && (
                      <ColumnSortButtons
                        isIncreasingOrder={Boolean(isIncreasingOrder)}
                        isDefaultSorted={sortColIndex === i}
                        clickHandler={(isIncreasingOrder: boolean) =>
                          sortClickHandler(isIncreasingOrder, i)
                        }
                      />
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {filteredData.length > 0 ? (
            getPagedRows().map((row: any, i: number) => (
              <TableRow key={i}>
                {columns.map((col, i) => {
                  const { cellProps = {} } = col;
                  return (
                    <TableCell key={`cell_${i}`} {...cellProps}>
                      {i === 0 && row.color && (
                        <React.Fragment>
                          <InlineIcon icon="mdi:square" color={row.color} height="15" width="15" />
                          &nbsp;
                        </React.Fragment>
                      )}
                      {'datum' in col ? row[col.datum] : col.getter(row)}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Empty>{t('No data matching the filter criteria.')}</Empty>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {filteredData.length > rowsPerPageOptions[0] && showPagination && (
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
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </TableContainer>
  );
}

const useStyles = makeStyles(theme => ({
  metadataNameCell: {
    fontSize: '1rem',
    textAlign: 'left',
    maxWidth: '100%',
    minWidth: '10rem',
    verticalAlign: 'top',
    paddingLeft: '0',
    paddingRight: '0',
    color: theme.palette.text.secondary,
    borderBottom: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.down('sm')]: {
      color: theme.palette.text.primary,
      fontSize: '1.5rem',
      minWidth: '100%',
      width: '100%',
      maxWidth: '100%',
      display: 'block',
      borderTop: `1px solid ${theme.palette.divider}`,
      borderBottom: `none`,
    },
  },
  metadataCell: {
    width: '100%',
    verticalAlign: 'top',
    fontSize: '1rem',
    overflowWrap: 'anywhere',
    paddingBottom: '3.5rem',
    borderBottom: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.down('sm')]: {
      color: theme.palette.text.secondary,
      minWidth: '100%',
      width: '100%',
      maxWidth: '100%',
      display: 'block',
      marginBottom: '2rem',
      borderBottom: `none`,
    },
  },
  metadataRow: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  metadataLast: {
    borderBottom: 'none',
  },
  table: {
    '& .MuiTableBody-root': {
      '& .MuiTableRow-root:last-child': {
        '& .MuiTableCell-root': {
          borderBottom: 'none',
        },
      },
    },
  },
}));

export interface NameValueTableRow {
  /** The name (key) for this row */
  name: string | JSX.Element;
  /** The value for this row */
  value?: string | JSX.Element | JSX.Element[];
  /** Whether this row should be hidden (can be a boolean or a function that will take the
   * @param value and return a boolean) */
  hide?: boolean | ((value: NameValueTableRow['value']) => boolean);
}

interface NameValueTableProps {
  rows: NameValueTableRow[];
  valueCellProps?: GridProps;
}

function Value({
  value,
}: {
  value: string | JSX.Element | JSX.Element[] | undefined;
}): JSX.Element | null {
  if (typeof value === 'undefined') {
    return null;
  } else if (typeof value === 'string') {
    return <ValueLabel>{value}</ValueLabel>;
  } else if (Array.isArray(value)) {
    return (
      <>
        {value.map((val, i) => (
          <Value value={val} key={i} />
        ))}
      </>
    );
  } else {
    return value;
  }
}

export function NameValueTable(props: NameValueTableProps) {
  const classes = useStyles();
  const { rows, valueCellProps } = props;

  return (
    <Grid
      container
      component="dl" // mount a Definition List
      spacing={3}
    >
      {rows.map(({ name, value, hide = false }, i) => {
        let shouldHide = false;
        if (typeof hide === 'function') {
          shouldHide = hide(value);
        } else {
          shouldHide = hide;
        }

        if (shouldHide) {
          return null;
        }

        const last = rows.length === i + 1;

        const { className, ...otherValueCellProps } = valueCellProps || {};

        return (
          <>
            <Grid
              item
              key={i}
              xs={12}
              sm={4}
              spacing={2}
              component="dt"
              className={clsx(last ? classes.metadataLast : '', classes.metadataNameCell)}
            >
              {name}
            </Grid>
            <Grid
              item
              key={i + 10000}
              xs={12}
              sm={8}
              spacing={2}
              component="dd"
              className={clsx(
                last ? classes.metadataLast : '',
                classes.metadataCell,
                className ? className : ''
              )}
              {...otherValueCellProps}
            >
              <Value value={value} />
            </Grid>
          </>
        );
      })}
    </Grid>
  );
}
