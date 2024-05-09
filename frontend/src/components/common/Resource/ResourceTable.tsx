import { TableCellProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MRT_Row, MRT_SortingFn } from 'material-react-table';
import { ComponentProps, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import helpers from '../../../helpers';
import { KubeObject } from '../../../lib/k8s/cluster';
import { useFilterFunc } from '../../../lib/util';
import { HeadlampEventType, useEventCallback } from '../../../redux/headlampEventSlice';
import { useTypedSelector } from '../../../redux/reducers/reducers';
import { useSettings } from '../../App/Settings/hook';
import { DateLabel } from '../Label';
import Link from '../Link';
import Table, { TableColumn } from '../Table';

export type ResourceTableColumn<RowItem> = {
  /** Unique id for the column, not required but recommended */
  id?: string;
  /** Show or hide the column @default true */
  show?: boolean;
  /** Label of the column that will be shown in the header */
  label: string;
  cellProps?: TableCellProps & {
    [propName: string]: any;
  };
  /**
   * By default the column will be sorted by the value provided in the getter
   * but you can provide your own sorting function here
   *
   * @default true
   **/
  sort?: boolean | ((a: RowItem, b: RowItem) => number);
  /** Change how filtering behaves, by default it will just search the text value */
  filterVariant?: TableColumn<any>['filterVariant'];
  disableFiltering?: boolean;
} & (
  | {
      /** To render a simple value provide property name of the item */
      datum: keyof RowItem;
      render?: never;
      getValue?: never;
    }
  | {
      datum?: never;
      /** How to render a cell */
      render?: (item: RowItem) => ReactNode;
      /** Plain value for filtering and sorting. This is going to be displayed unless render property is defined */
      getValue: (item: RowItem) => string | number | null | undefined;
    }
  | {
      datum?: never;
      render?: never;
      /** @deprecated please use getValue and render (optional, if you need custom renderer) */
      getter: (item: RowItem) => any;
    }
);

type ColumnType = 'age' | 'name' | 'namespace' | 'type' | 'kind';

export interface ResourceTableProps<RowItem> {
  /** The columns to be rendered, like used in SimpleTable, or by name. */
  columns: (ResourceTableColumn<RowItem> | ColumnType)[];
  /** Provide a list of columns that won't be shown and cannot be turned on */
  hideColumns?: string[] | null;
  /** ID for the table. Will be used by plugins to identify this table.
   * Official tables in Headlamp will have the 'headlamp-' prefix for their IDs which is followed by the resource's plural name or the section in Headlamp the table is in.
   * Plugins should use their own prefix when creating tables, to avoid any clashes.
   */
  id?: string;
  /** Deny plugins to process this table's columns. */
  noProcessing?: boolean;
  /** The callback for when the columns chooser is closed. */
  onColumnChooserClose?: () => void;
  /** Column to be sorted */
  defaultSortingColumn?: { id: string; desc: boolean };
  data: Array<RowItem> | null;
  filterFunction?: (item: RowItem) => boolean;
  errorMessage?: string | null;
  reflectInURL?: string | boolean;
}

export interface ResourceTableFromResourceClassProps<RowItem>
  extends Omit<ResourceTableProps<RowItem>, 'data'> {
  resourceClass: KubeObject;
}

export default function ResourceTable<RowItem>(
  props: ResourceTableFromResourceClassProps<RowItem> | ResourceTableProps<RowItem>
) {
  if (!!(props as ResourceTableFromResourceClassProps<RowItem>).resourceClass) {
    const { resourceClass, ...otherProps } = props as ResourceTableFromResourceClassProps<RowItem>;
    return <TableFromResourceClass resourceClass={resourceClass!} {...otherProps} />;
  }

  return <ResourceTableContent {...(props as ResourceTableProps<RowItem>)} />;
}

function TableFromResourceClass<RowItem>(props: ResourceTableFromResourceClassProps<RowItem>) {
  const { resourceClass, id, ...otherProps } = props;
  const [items, error] = resourceClass.useList();
  // throttle the update of the table to once per second
  const throttledItems = useThrottle(items, 1000);
  const dispatchHeadlampEvent = useEventCallback(HeadlampEventType.LIST_VIEW);

  useEffect(() => {
    dispatchHeadlampEvent({
      resources: items,
      resourceKind: resourceClass.className,
      error: error || undefined,
    });
  }, [items, error]);

  return (
    <ResourceTableContent
      errorMessage={resourceClass.getErrorMessage(error)}
      id={id || `headlamp-${resourceClass.pluralName}`}
      {...otherProps}
      data={throttledItems}
    />
  );
}

/**
 * Here we figure out which columns are visible and not visible
 * We can control it using show property in the columns prop {@link ResourceTableColumn}
 * And when user manually changes visibility it is saved to localStorage
 */
function initColumnVisibilityState(columns: ResourceTableProps<any>['columns'], tableId?: string) {
  const visibility: Record<string, boolean> = {};

  // Apply default visibility we got from the props
  columns.forEach((col, index) => {
    if (typeof col === 'string') return;

    if ('show' in col) {
      visibility[col.id ?? String(index)] = col.show ?? true;
    }
  });

  // Load and apply persisted settings from local storage
  if (tableId) {
    const localTableSettins = helpers.loadTableSettings(tableId);
    localTableSettins.forEach(({ id, show }) => (visibility[id] = show));
  }

  return visibility;
}

// By default MRT passes row object to the sorting function but we only need the original item
function sortingFn(sortFn?: (a: any, b: any) => number): MRT_SortingFn<any> | undefined {
  if (!sortFn) return undefined;

  return (a: any, b: any) => sortFn(a.original, b.original);
}

/**
 * Returns a throttled version of the input value.
 *
 * @param value - The value to be throttled.
 * @param interval - The interval in milliseconds to throttle the value.
 * @returns The throttled value.
 */
export function useThrottle(value: any, interval = 1000): any {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastEffected = useRef(Date.now() + interval);

  // Ensure we don't throttle holding the loading null or undefined value before
  // real data comes in. Otherwise we could wait up to interval milliseconds
  // before we update the throttled value.
  //
  //   numEffected == 0,  null, or undefined whilst loading.
  //   numEffected == 1,  real data.
  const numEffected = useRef(0);

  useEffect(() => {
    const now = Date.now();

    if (now >= lastEffected.current + interval || numEffected.current < 2) {
      numEffected.current = numEffected.current + 1;
      lastEffected.current = now;
      setThrottledValue(value);
    } else {
      const id = window.setTimeout(() => {
        lastEffected.current = now;
        setThrottledValue(value);
      }, interval);

      return () => window.clearTimeout(id);
    }
  }, [value, interval]);

  return throttledValue;
}

function ResourceTableContent<RowItem>(props: ResourceTableProps<RowItem>) {
  const {
    columns,
    defaultSortingColumn,
    id,
    noProcessing = false,
    hideColumns = [],
    filterFunction,
    errorMessage,
    reflectInURL,
    data,
  } = props;
  const { t } = useTranslation(['glossary', 'translation']);
  const theme = useTheme();
  const storeRowsPerPageOptions = useSettings('tableRowsPerPageOptions');
  const tableProcessors = useTypedSelector(state => state.resourceTable.tableColumnsProcessors);
  const filter = useTypedSelector(state => state.filter);
  const defaultFilterFunc = useFilterFunc();
  const [columnVisibility, setColumnVisibility] = useState(() =>
    initColumnVisibilityState(columns, id)
  );

  const [tableSettings] = useState<{ id: string; show: boolean }[]>(
    !!id ? helpers.loadTableSettings(id) : []
  );

  const [allColumns, sort] = useMemo(() => {
    let processedColumns = columns;

    if (!noProcessing) {
      tableProcessors.forEach(processorInfo => {
        console.debug('Processing columns with processor: ', processorInfo.id, '...');
        processedColumns =
          processorInfo.processor({ id: id || '', columns: processedColumns }) || [];
      });
    }
    const allColumns = processedColumns
      .map((col, index): TableColumn<KubeObject> => {
        const indexId = String(index);

        if (typeof col !== 'string') {
          const column = col as ResourceTableColumn<RowItem>;

          const sort = column.sort ?? true;

          const mrtColumn: TableColumn<KubeObject> = {
            id: column.id ?? indexId,
            header: column.label,
            filterVariant: column.filterVariant,
            enableMultiSort: !!sort,
            enableSorting: !!sort,
            enableColumnFilter: !column.disableFiltering,
            muiTableHeadCellProps: column.cellProps,
            muiTableBodyCellProps: column.cellProps,
            grow: false,
          };

          if ('getValue' in column) {
            mrtColumn.accessorFn = column.getValue;
          } else if ('getter' in column) {
            mrtColumn.accessorFn = column.getter;
          } else {
            mrtColumn.accessorFn = (item: KubeObject) => item[column.datum];
          }
          if ('render' in column) {
            mrtColumn.Cell = ({ row }: { row: MRT_Row<any> }) =>
              column.render?.(row.original) ?? null;
          }
          if (sort && typeof sort === 'function') {
            mrtColumn.sortingFn = sortingFn(sort);
          }

          return mrtColumn;
        }

        switch (col) {
          case 'name':
            return {
              id: 'name',
              header: t('translation|Name'),
              accessorFn: (item: KubeObject) => item.metadata.name,
              Cell: ({ row }: { row: MRT_Row<any> }) =>
                row.original && <Link kubeObject={row.original} />,
            };
          case 'age':
            return {
              id: 'age',
              header: t('translation|Age'),
              accessorFn: (item: KubeObject) =>
                -new Date(item.metadata.creationTimestamp).getTime(),
              muiTableHeadCellProps: { align: 'right' },
              muiTableBodyCellProps: { align: 'right' },
              enableColumnFilter: false,
              Cell: ({ row }: { row: MRT_Row<KubeObject> }) =>
                row.original && (
                  <DateLabel
                    date={row.original.metadata.creationTimestamp}
                    format="mini"
                    iconProps={{ color: theme.palette.text.primary }}
                  />
                ),
            };
          case 'namespace':
            return {
              id: 'namespace',
              header: t('glossary|Namespace'),
              accessorFn: (item: KubeObject) => item.getNamespace(),
              filterVariant: 'multi-select',
              Cell: ({ row }: { row: MRT_Row<KubeObject> }) =>
                row.original?.getNamespace() ? (
                  <Link routeName="namespace" params={{ name: row.original.getNamespace() }}>
                    {row.original.getNamespace()}
                  </Link>
                ) : (
                  ''
                ),
            };
          case 'type':
          case 'kind':
            return {
              id: 'kind',
              header: t('translation|Type'),
              Cell: ({ row }: { row: MRT_Row<KubeObject> }) => row.original.kind,
              accessorFn: (resource: KubeObject) => resource?.kind,
              filterVariant: 'multi-select',
            };
          default:
            throw new Error(`Unknown column: ${col}`);
        }
      })
      .filter(col => !hideColumns?.includes(col.id ?? '')) as TableColumn<KubeObject>[];

    let sort = undefined;
    const sortingColumn = defaultSortingColumn ?? allColumns.find(it => it.id === 'age');
    if (sortingColumn) {
      sort = {
        id: sortingColumn.id!,
        desc: false,
      };
    }

    return [allColumns, sort];
  }, [
    columns,
    hideColumns,
    id,
    noProcessing,
    defaultSortingColumn,
    tableProcessors,
    tableSettings,
  ]);

  function onColumnsVisibilityChange(updater: any): void {
    setColumnVisibility(oldCols => {
      const newCols = updater(oldCols);

      if (!!id) {
        const colsToStore = Object.entries(newCols).map(([id, show]) => ({
          id,
          show: (show ?? true) as boolean,
        }));
        helpers.storeTableSettings(id, colsToStore);
      }

      return newCols;
    });
  }

  const initialState: ComponentProps<typeof Table>['initialState'] = {
    sorting: sort ? [sort] : undefined,
  };

  if (filter.search) {
    initialState.globalFilter = filter.search;
    initialState.showGlobalFilter = true;
  }

  return (
    <>
      <Table
        enableFullScreenToggle={false}
        enableFacetedValues
        errorMessage={errorMessage}
        // @todo: once KubeObject is not any we can remove this casting
        columns={allColumns as TableColumn<Record<string, any>>[]}
        data={(data ?? []) as Array<Record<string, any>>}
        loading={data === null}
        initialState={initialState}
        rowsPerPage={storeRowsPerPageOptions}
        state={{
          columnVisibility,
        }}
        reflectInURL={reflectInURL}
        onColumnVisibilityChange={onColumnsVisibilityChange as any}
        filterFunction={
          (filterFunction ?? defaultFilterFunc) as (item: Record<string, any>) => boolean
        }
      />
    </>
  );
}
