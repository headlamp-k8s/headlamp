import { Box } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ApiError } from '../../../lib/k8s/apiProxy';
import { KubeObject } from '../../../lib/k8s/cluster';
import { getClusterGroup, useFilterFunc } from '../../../lib/util';
import { useSettings } from '../../App/Settings/hook';
import { ClusterGroupErrorMessage } from '../../cluster/ClusterGroupErrorMessage';
import { DateLabel } from '../Label';
import Link from '../Link';
import SimpleTable, { SimpleTableProps } from '../SimpleTable';

type SimpleTableColumn = SimpleTableProps['columns'][number];

type ColumnType = 'age' | 'name' | 'namespace' | 'type' | 'kind' | 'cluster';

export interface ResourceTableProps extends Omit<SimpleTableProps, 'columns'> {
  /** The columns to be rendered, like used in SimpleTable, or by name */
  columns: (SimpleTableColumn | ColumnType)[];
  /** Any errors per cluster (useful when using the table a in a multi-cluster listing) */
  clusterErrors?: { [cluster: string]: ApiError | null } | null;
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
  const isMultiCluster = getClusterGroup().length > 0;
  const [items, error, , , errorsPerCluster] = resourceClass.useList();

  return (
    <Table
      errorMessage={resourceClass.getErrorMessage(error)}
      {...otherProps}
      clusterErrors={isMultiCluster ? errorsPerCluster : undefined}
      data={items}
    />
  );
}

function Table(props: ResourceTableProps) {
  const { columns, defaultSortingColumn, clusterErrors, ...otherProps } = props;
  const { t } = useTranslation(['glossary', 'frequent']);
  const theme = useTheme();
  const storeRowsPerPageOptions = useSettings('tableRowsPerPageOptions');
  const clusters = getClusterGroup();

  let sortingColumn = defaultSortingColumn;

  function removeClusterColIfNeeded(cols: typeof columns) {
    return cols.filter(col => clusters.length > 1 || col !== 'cluster');
  }

  const cols: SimpleTableColumn[] = removeClusterColIfNeeded(columns).map((col, index) => {
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
      case 'cluster':
        return {
          label: t('glossary|Cluster'),
          getter: (resource: KubeObject) => resource.cluster,
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

  // Remove clusters whose errors are null.
  function cleanNullErrors(errors: typeof clusterErrors) {
    if (!errors) {
      return {};
    }
    const cleanedErrors: typeof clusterErrors = {};
    Object.entries(errors).forEach(([cluster, error]) => {
      if (error !== null) {
        cleanedErrors[cluster] = error;
      }
    });

    return cleanedErrors;
  }

  const cleanedErrors = React.useMemo(() => cleanNullErrors(clusterErrors), [clusterErrors]);

  return (
    <>
      {Object.keys(cleanedErrors).length > 0 && (
        <Box pt={2}>
          <ClusterGroupErrorMessage clusters={cleanedErrors} />
        </Box>
      )}
      <SimpleTable
        columns={cols.filter(col => col !== null) as SimpleTableColumn[]}
        rowsPerPage={storeRowsPerPageOptions}
        defaultSortingColumn={sortingColumn}
        filterFunction={useFilterFunc()}
        reflectInURL
        {...otherProps}
      />
    </>
  );
}
