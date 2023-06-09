import { useTheme } from '@material-ui/core/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { KubeObject } from '../../../lib/k8s/cluster';
import { useFilterFunc } from '../../../lib/util';
import { useTypedSelector } from '../../../redux/reducers/reducers';
import { useSettings } from '../../App/Settings/hook';
import ActionButton from '../ActionButton';
import { DateLabel } from '../Label';
import Link from '../Link';
import SimpleTable, { SimpleTableProps } from '../SimpleTable';
import TableColumnChooserPopup from '../TableColumnChooserPopup';

type SimpleTableColumn = SimpleTableProps['columns'][number];

type ColumnType = 'age' | 'name' | 'namespace' | 'type' | 'kind';

export interface ResourceTableProps extends Omit<SimpleTableProps, 'columns'> {
  /** The columns to be rendered, like used in SimpleTable, or by name. */
  columns: (SimpleTableColumn | ColumnType)[];
  /** ID for the table. Will be used by plugins to identify this table.
   * Official tables in Headlamp will have the 'headlamp-' prefix for their IDs which is followed by the resource's plural name or the section in Headlamp the table is in.
   * Plugins should use their own prefix when creating tables, to avoid any clashes.
   */
  id?: string;
  /** Deny plugins to process this table's columns. */
  noProcessing?: boolean;
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

function TableFromResourceClass(props: ResourceTableFromResourceClassProps) {
  const { resourceClass, id, ...otherProps } = props;
  const [items, error] = resourceClass.useList();

  return (
    <Table
      errorMessage={resourceClass.getErrorMessage(error)}
      id={id || `headlamp-${resourceClass.pluralName}`}
      {...otherProps}
      data={items}
    />
  );
}

function Table(props: ResourceTableProps) {
  const { columns, defaultSortingColumn, id, noProcessing = false, ...otherProps } = props;
  const { t } = useTranslation(['glossary', 'frequent']);
  const theme = useTheme();
  const storeRowsPerPageOptions = useSettings('tableRowsPerPageOptions');
  const tableProcessors = useTypedSelector(state => state.ui.views.tableColumnsProcessors);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  let sortingColumn = defaultSortingColumn;

  let processedColumns = columns;

  if (!noProcessing) {
    tableProcessors.forEach(processorInfo => {
      console.debug('Processing columns with processor: ', processorInfo.id, '...');
      processedColumns = processorInfo.processor({ id: id || '', columns: processedColumns }) || [];
    });
  }

  const cols: SimpleTableColumn[] = processedColumns.map((col, index) => {
    if (typeof col !== 'string') {
      return col;
    }

    switch (col) {
      case 'name':
        return {
          label: t('frequent|Name'),
          getter: (resource: KubeObject) => <Link kubeObject={resource} />,
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
          label: t('frequent|Age'),
          cellProps: { style: { textAlign: 'right' } },
          getter: resource => (
            <DateLabel
              date={resource.metadata.creationTimestamp}
              format="mini"
              iconProps={{ color: theme.palette.grey.A700 }}
            />
          ),
          sort: (n1: KubeObject, n2: KubeObject) =>
            new Date(n2.metadata.creationTimestamp).getTime() -
            new Date(n1.metadata.creationTimestamp).getTime(),
        };
      case 'namespace':
        return {
          label: t('glossary|Namespace'),
          getter: (resource: KubeObject) =>
            resource.getNamespace() ? (
              <Link routeName="namespace" params={{ name: resource.getNamespace() }}>
                {resource.getNamespace()}
              </Link>
            ) : (
              ''
            ),
          sort: true,
        };
      case 'type':
      case 'kind':
        return {
          label: t('frequent|Type'),
          getter: (resource: KubeObject) => resource.kind,
          sort: true,
        };
      default:
        throw new Error(`Unknown column: ${col}`);
    }
  });

  cols.push({
    label: 'lll',
    header: (
      <ActionButton
        iconButtonProps={{ size: 'small' }}
        description={t('frequent|Filter columns')}
        icon="mdi:format-list-checks"
        onClick={event => {
          setAnchorEl(event.currentTarget);
        }}
      />
    ),
    cellProps: { style: { textAlign: 'right', maxWidth: '45px' } },
    getter: () => null,
  });

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
        columns={cols}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        onToggleColumn={col => console.log('>>>>>COLL', col)}
      />
    </>
  );
}
