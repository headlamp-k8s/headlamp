import { useTheme } from '@mui/material/styles';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import helpers from '../../../helpers';
import { KubeObject } from '../../../lib/k8s/cluster';
import { useFilterFunc } from '../../../lib/util';
import { useTypedSelector } from '../../../redux/reducers/reducers';
import { useSettings } from '../../App/Settings/hook';
import { DateLabel } from '../Label';
import Link from '../Link';
import SimpleTable, {
  SimpleTableDatumColumn,
  SimpleTableGetterColumn,
  SimpleTableProps,
} from '../SimpleTable';
import TableColumnChooserPopup from './ResourceTableColumnChooser';

interface ToggableColumn {
  id?: string;
  show?: boolean;
}

export type ResourceTableColumn =
  | (ToggableColumn & SimpleTableDatumColumn)
  | (ToggableColumn & SimpleTableGetterColumn);

type ColumnType = 'age' | 'name' | 'namespace' | 'type' | 'kind';

export interface ResourceTableProps extends Omit<SimpleTableProps, 'columns'> {
  /** The columns to be rendered, like used in SimpleTable, or by name. */
  columns: (ResourceTableColumn | ColumnType)[];
  /** ID for the table. Will be used by plugins to identify this table.
   * Official tables in Headlamp will have the 'headlamp-' prefix for their IDs which is followed by the resource's plural name or the section in Headlamp the table is in.
   * Plugins should use their own prefix when creating tables, to avoid any clashes.
   */
  id?: string;
  /** Deny plugins to process this table's columns. */
  noProcessing?: boolean;
  /** The anchor element for the column chooser popup. */
  columnChooserAnchor?: HTMLElement | null;
  /** The callback for when the columns chooser is closed. */
  onColumnChooserClose?: () => void;
}

export interface ResourceTableFromResourceClassProps extends Omit<ResourceTableProps, 'data'> {
  resourceClass: KubeObject;
}

export default function ResourceTable(
  props: ResourceTableFromResourceClassProps | ResourceTableProps
) {
  if (!!(props as ResourceTableFromResourceClassProps).resourceClass) {
    const { resourceClass, ...otherProps } = props as ResourceTableFromResourceClassProps;
    return <TableFromResourceClass resourceClass={resourceClass!} {...otherProps} />;
  }

  return <Table {...(props as ResourceTableProps)} />;
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

function TableFromResourceClass(props: ResourceTableFromResourceClassProps) {
  const { resourceClass, id, ...otherProps } = props;
  const [items, error] = resourceClass.useList();
  // throttle the update of the table to once per second
  const throttledItems = useThrottle(items, 1000);

  return (
    <Table
      errorMessage={resourceClass.getErrorMessage(error)}
      id={id || `headlamp-${resourceClass.pluralName}`}
      {...otherProps}
      data={throttledItems}
    />
  );
}

type ResourceTableColumnWithDefaultShow = ResourceTableColumn & { defaultShow?: boolean };

function Table(props: ResourceTableProps) {
  const {
    columns,
    defaultSortingColumn,
    id,
    noProcessing = false,
    columnChooserAnchor = null,
    onColumnChooserClose,
    ...otherProps
  } = props;
  const { t } = useTranslation(['glossary', 'translation']);
  const theme = useTheme();
  const storeRowsPerPageOptions = useSettings('tableRowsPerPageOptions');
  const tableProcessors = useTypedSelector(state => state.resourceTable.tableColumnsProcessors);
  const [tableSettings, setTableSettings] = useState<{ id: string; show: boolean }[]>(
    !!id ? helpers.loadTableSettings(id) : []
  );

  const [resourceCols, cols, sortingColumn] = useMemo(() => {
    let sortingColumn = defaultSortingColumn;

    let processedColumns = columns;

    if (!noProcessing) {
      tableProcessors.forEach(processorInfo => {
        console.debug('Processing columns with processor: ', processorInfo.id, '...');
        processedColumns =
          processorInfo.processor({ id: id || '', columns: processedColumns }) || [];
      });
    }

    const resourceCols: ResourceTableColumnWithDefaultShow[] = processedColumns
      .map((col, index) => {
        if (typeof col !== 'string') {
          return col;
        }

        switch (col) {
          case 'name':
            return {
              id: 'name',
              label: t('translation|Name'),
              gridTemplate: 1.5,
              getter: (resource: KubeObject) => resource && <Link kubeObject={resource} />,
              sort: (n1: KubeObject, n2: KubeObject) => {
                if (n1.metadata.name < n2.metadata.name) {
                  return -1;
                } else if (n1.metadata.name > n2.metadata.name) {
                  return 1;
                }
                return 0;
              },
            };
          case 'age':
            if (sortingColumn === undefined) {
              sortingColumn = index + 1;
            }
            return {
              id: 'age',
              label: t('translation|Age'),
              cellProps: { style: { textAlign: 'right' } },
              gridTemplate: 0.5,
              getter: (resource: KubeObject) =>
                resource && (
                  <DateLabel
                    date={resource.metadata.creationTimestamp}
                    format="mini"
                    iconProps={{ color: theme.palette.text.primary }}
                  />
                ),
              sort: (n1: KubeObject, n2: KubeObject) =>
                new Date(n2.metadata.creationTimestamp).getTime() -
                new Date(n1.metadata.creationTimestamp).getTime(),
            };
          case 'namespace':
            return {
              id: 'namespace',
              label: t('glossary|Namespace'),
              getter: (resource: KubeObject) =>
                resource?.getNamespace() ? (
                  <Link routeName="namespace" params={{ name: resource.getNamespace() }}>
                    {resource.getNamespace()}
                  </Link>
                ) : (
                  ''
                ),
              sort: (n1: KubeObject, n2: KubeObject) => {
                const ns1 = n1.getNamespace() || '';
                const ns2 = n2.getNamespace() || '';
                if (ns1 < ns2) {
                  return -1;
                } else if (ns1 > ns2) {
                  return 1;
                }
                return 0;
              },
            };
          case 'type':
          case 'kind':
            return {
              id: 'kind',
              label: t('translation|Type'),
              getter: (resource: KubeObject) => resource?.kind,
              sort: true,
            };
          default:
            throw new Error(`Unknown column: ${col}`);
        }
      })
      .map((col, idx) => {
        const newCol: ResourceTableColumnWithDefaultShow = { id: col.id || idx.toString(), ...col };
        // Assign the default show value so we can remember it later.
        newCol.defaultShow = newCol.show ?? true;

        // Assign the actual show value from whatever is stored in the table settings.
        const colSettings = tableSettings.find(col => col.id === newCol.id);
        newCol.show = colSettings?.show ?? newCol.defaultShow;
        return newCol;
      });

    // Filter out columns that have show set to false.
    const cols = resourceCols.filter(col => col.show !== false);
    return [resourceCols, cols, sortingColumn];
  }, [columns, id, noProcessing, defaultSortingColumn, tableProcessors, tableSettings]);

  function onColumnsVisibilityToggled(cols: ResourceTableColumn[]) {
    if (!!id) {
      const colsToStore = cols.filter(
        c => resourceCols.find(rc => rc.id === c.id)?.defaultShow !== c.show
      );
      helpers.storeTableSettings(
        id || '',
        colsToStore.map(c => ({ id: c.id || '', show: c.show ?? true }))
      );
    }
    setTableSettings(cols.map(c => ({ id: c.id || '', show: c.show || c.show === undefined })));
  }

  return (
    <>
      <SimpleTable
        columns={cols}
        rowsPerPage={storeRowsPerPageOptions}
        defaultSortingColumn={sortingColumn}
        filterFunction={useFilterFunc()}
        reflectInURL
        {...otherProps}
      />
      <TableColumnChooserPopup
        columns={resourceCols}
        anchorEl={columnChooserAnchor}
        onClose={() => {
          onColumnChooserClose && onColumnChooserClose();
        }}
        onToggleColumn={onColumnsVisibilityToggled}
      />
    </>
  );
}
