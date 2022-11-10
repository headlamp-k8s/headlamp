import { useTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { KubeObject } from '../../../lib/k8s/cluster';
import { useFilterFunc } from '../../../lib/util';
import { DateLabel } from '../Label';
import Link from '../Link';
import SimpleTable, { SimpleTableProps } from '../SimpleTable';

type SimpleTableColumn = SimpleTableProps['columns'][number];

type ColumnType = 'age' | 'name' | 'namespace' | 'type' | 'kind';

export interface ResourceTableProps extends Omit<SimpleTableProps, 'columns'> {
  /** The columns to be rendered, like used in SimpleTable, or by name */
  columns: (SimpleTableColumn | ColumnType)[];
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
  const { resourceClass, ...otherProps } = props;
  const [items, error] = resourceClass.useList();

  return <Table errorMessage={resourceClass.getErrorMessage(error)} {...otherProps} data={items} />;
}

function Table(props: ResourceTableProps) {
  const { columns, defaultSortingColumn, ...otherProps } = props;
  const { t } = useTranslation(['glossary', 'frequent']);
  const theme = useTheme();

  let sortingColumn = defaultSortingColumn;

  const cols: SimpleTableColumn[] = columns.map((col, index) => {
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
          getter: (resource: KubeObject) => resource.getNamespace(),
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

  return (
    <SimpleTable
      columns={cols}
      rowsPerPage={[15, 25, 50]}
      defaultSortingColumn={sortingColumn}
      filterFunction={useFilterFunc()}
      reflectInURL
      {...otherProps}
    />
  );
}
