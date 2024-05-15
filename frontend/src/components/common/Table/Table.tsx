import { Box, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  MaterialReactTable,
  MRT_ColumnDef as MaterialTableColumn,
  MRT_Localization,
  MRT_TableOptions as MaterialTableOptions,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_DE } from 'material-react-table/locales/de';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { MRT_Localization_FR } from 'material-react-table/locales/fr';
import { MRT_Localization_PT } from 'material-react-table/locales/pt';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import helpers from '../../../helpers';
import { useURLState } from '../../../lib/util';
import { useSettings } from '../../App/Settings/hook';
import Empty from '../EmptyContent';
import Loader from '../Loader';

/**
 * Column definition
 * We reuse the Material React Table column definition
 * Additional gridTemplate property is added because we have our own layout
 * based on the CSS grid
 *
 * @see https://www.material-react-table.com/docs/api/column-options
 */
export type TableColumn<RowItem extends Record<string, any>, Value = any> = MaterialTableColumn<
  RowItem,
  Value
> & {
  /**
   * Column width in the grid template format
   * Number values will be converted to "fr"
   * @example
   * 1
   * "1.5fr"
   * "min-content"
   */
  gridTemplate?: string | number;
};

/**
 * All the options provided by the MRT and some of our custom behaviour
 *
 * @see https://www.material-react-table.com/docs/api/table-options
 */
export type TableProps<RowItem extends Record<string, any>> = Omit<
  MaterialTableOptions<RowItem>,
  'columns'
> & {
  columns: TableColumn<RowItem>[];
  /**
   * Message to show when the table is empty
   */
  emptyMessage?: ReactNode;
  /**
   * Error message to show instead of the table
   */
  errorMessage?: ReactNode;
  /** Whether to reflect the page/perPage properties in the URL.
   * If assigned to a string, it will be the prefix for the page/perPage parameters.
   * If true or '', it'll reflect the parameters without a prefix.
   * By default, no parameters are reflected in the URL. */
  reflectInURL?: string | boolean;
  /**
   * Initial page to show in the table
   * Important: page is 1-indexed!
   * @default 1
   */
  initialPage?: number;
  /**
   * List of options for the rows per page selector
   * @example [15, 25, 50]
   */
  rowsPerPage?: number[];
  /**
   * Function to filter the rows
   * Works in addition to the default table filtering and searching
   */
  filterFunction?: (item: RowItem) => boolean;
  /**
   * Whether to show a loading spinner
   */
  loading?: boolean;
};

// Use a zero-indexed "useURLState" hook, so pages are shown in the URL as 1-indexed
// but internally are 0-indexed.
function usePageURLState(
  key: string,
  prefix: string,
  initialPage: number
): ReturnType<typeof useURLState> {
  const [page, setPage] = useURLState(key, { defaultValue: initialPage + 1, prefix });
  const [zeroIndexPage, setZeroIndexPage] = useState(page - 1);

  useEffect(() => {
    setZeroIndexPage((zeroIndexPage: number) => {
      if (page - 1 !== zeroIndexPage) {
        return page - 1;
      }

      return zeroIndexPage;
    });
  }, [page]);

  useEffect(() => {
    setPage(zeroIndexPage + 1);
  }, [zeroIndexPage]);

  return [zeroIndexPage, setZeroIndexPage];
}

const tableLocalizationMap: Record<string, MRT_Localization> = {
  de: MRT_Localization_DE,
  en: MRT_Localization_EN,
  es: MRT_Localization_ES,
  fr: MRT_Localization_FR,
  pt: MRT_Localization_PT,
};

/**
 * Table component based on the Material React Table
 *
 * @see https://www.material-react-table.com/docs
 */
export default function Table<RowItem extends Record<string, any>>({
  emptyMessage,
  reflectInURL,
  initialPage = 1,
  rowsPerPage,
  filterFunction,
  errorMessage,
  loading,
  ...tableProps
}: TableProps<RowItem>) {
  const shouldReflectInURL = reflectInURL !== undefined && reflectInURL !== false;
  const prefix = reflectInURL === true ? '' : reflectInURL || '';
  const [page, setPage] = usePageURLState(shouldReflectInURL ? 'p' : '', prefix, initialPage);

  const storeRowsPerPageOptions = useSettings('tableRowsPerPageOptions');
  const rowsPerPageOptions = rowsPerPage || storeRowsPerPageOptions;
  const defaultRowsPerPage = useMemo(() => helpers.getTablesRowsPerPage(rowsPerPageOptions[0]), []);
  const [pageSize, setPageSize] = useURLState(shouldReflectInURL ? 'perPage' : '', {
    defaultValue: defaultRowsPerPage,
    prefix,
  });

  const { t, i18n } = useTranslation();
  const theme = useTheme();

  // Provide defaults for the columns
  const tableColumns: TableColumn<RowItem>[] = useMemo(
    () =>
      tableProps.columns.map((column, i) => ({
        ...column,
        id: column.id ?? String(i),
        header: column.header || '',
      })),
    [tableProps.columns]
  );

  const tableData = useMemo(() => {
    if (!filterFunction) return tableProps.data ?? [];
    return (tableProps.data ?? []).filter(it => filterFunction(it));
  }, [tableProps.data, filterFunction]);

  const gridTemplateColumns = tableProps.columns
    .filter(it => {
      const isHidden = tableProps.state?.columnVisibility?.[it.id!] === false;
      return !isHidden;
    })
    .map(it => {
      if (typeof it.gridTemplate === 'number') {
        return `${it.gridTemplate}fr`;
      }
      return it.gridTemplate ?? '1fr';
    })
    .join(' ');

  const table = useMaterialReactTable({
    ...tableProps,
    columns: tableColumns ?? [],
    data: tableData,
    enableDensityToggle: tableProps.enableDensityToggle ?? false,
    enableFullScreenToggle: tableProps.enableFullScreenToggle ?? false,
    localization: tableLocalizationMap[i18n.language],
    autoResetAll: false,
    onPaginationChange: (updater: any) => {
      if (!tableProps.data?.length) return;
      const pagination = updater({ pageIndex: Number(page) - 1, pageSize: Number(pageSize) });
      setPage(pagination.pageIndex + 1);
      setPageSize(pagination.pageSize);
    },
    initialState: {
      density: 'compact',
      ...(tableProps.initialState ?? {}),
    },
    state: {
      ...(tableProps.state ?? {}),
      pagination: {
        pageIndex: page - 1,
        pageSize: pageSize,
      },
    },
    layoutMode: 'grid',
    // Need to provide our own empty message
    // because default one breaks with our custom layout
    renderEmptyRowsFallback: () => (
      <Box height={60}>
        <Box position="absolute" left={0} right={0} textAlign="center">
          <Empty>{t('No results found')}</Empty>
        </Box>
      </Box>
    ),
    muiPaginationProps: {
      rowsPerPageOptions: rowsPerPageOptions,
      showFirstButton: false,
      showLastButton: false,
    },
    muiTableBodyCellProps: {
      sx: {
        // By default in compact mode text doesn't wrap
        // so we need to override that
        whiteSpace: 'normal',
        width: 'unset',
        minWidth: 'unset',
      },
    },
    muiTablePaperProps: {
      variant: 'outlined',
      elevation: 0,
      sx: {
        display: 'grid',
      },
    },
    muiTableBodyProps: {
      sx: {
        display: 'contents',
      },
    },
    muiTableBodyRowProps: {
      sx: {
        display: 'contents',
        backgroundColor: theme.palette.tables.body.background,
      },
    },
    muiBottomToolbarProps: {
      sx: {
        backgroundColor: undefined,
        boxShadow: undefined,
      },
    },
    muiTableProps: {
      sx: {
        gridTemplateColumns,
      },
    },
    muiTableHeadProps: {
      sx: {
        display: 'contents',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        width: 'unset',
        minWidth: 'unset',
        borderTop: '1px solid',
        borderColor: theme.palette.tables.head.borderColor,
        paddingTop: '0.5rem',
      },
    },
    muiTableHeadRowProps: {
      sx: {
        display: 'contents',
        background: theme.palette.tables.head.background,
        boxShadow: undefined,
      },
    },
  });

  if (!!errorMessage) {
    return <Empty color="error">{errorMessage}</Empty>;
  }

  if (loading) {
    return <Loader title={t('Loading table data')} />;
  }

  if (!tableProps.data?.length && !loading) {
    return (
      <Paper variant="outlined">
        <Empty>{emptyMessage || t('No data to be shown.')}</Empty>
      </Paper>
    );
  }

  return <MaterialReactTable table={table} />;
}
