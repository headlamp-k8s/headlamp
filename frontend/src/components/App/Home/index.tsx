import { Icon } from '@iconify/react';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import isEqual from 'lodash/isEqual';
import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import helpers from '../../../helpers';
import { useClustersConf, useClustersVersion } from '../../../lib/k8s';
import { ApiError, deleteCluster } from '../../../lib/k8s/apiProxy';
import { Cluster } from '../../../lib/k8s/cluster';
import Event from '../../../lib/k8s/event';
import { createRouteURL } from '../../../lib/router';
import { useId } from '../../../lib/util';
import { setConfig } from '../../../redux/configSlice';
import { Link, PageGrid, SectionBox, SectionFilterHeader } from '../../common';
import { ConfirmDialog } from '../../common';
import ResourceTable from '../../common/Resource/ResourceTable';
import RecentClusters from './RecentClusters';

function ContextMenu({ cluster }: { cluster: Cluster }) {
  const { t } = useTranslation(['translation']);
  const history = useHistory();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuId = useId('context-menu');
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);

  function removeCluster(cluster: Cluster) {
    deleteCluster(cluster.name || '')
      .then(config => {
        dispatch(setConfig(config));
      })
      .catch((err: Error) => {
        if (err.message === 'Not Found') {
          // TODO: create notification with error message
        }
      })
      .finally(() => {
        history.push('/');
      });
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  return (
    <>
      <IconButton
        size="small"
        onClick={event => {
          setAnchorEl(event.currentTarget);
        }}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-label={t('Actions')}
      >
        <Icon icon="mdi:more-vert" />
      </IconButton>
      <Menu
        id={menuId}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => {
          handleMenuClose();
        }}
      >
        <MenuItem
          onClick={() => {
            history.push(createRouteURL('cluster', { cluster: cluster.name }));
            handleMenuClose();
          }}
        >
          <ListItemText>{t('translation|View')}</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            history.push(createRouteURL('settingsCluster', { cluster: cluster.name }));
            handleMenuClose();
          }}
        >
          <ListItemText>{t('translation|Settings')}</ListItemText>
        </MenuItem>
        {helpers.isElectron() && cluster.meta_data?.source === 'dynamic_cluster' && (
          <MenuItem
            onClick={() => {
              setOpenConfirmDialog(true);
              handleMenuClose();
            }}
          >
            <ListItemText>{t('translation|Delete')}</ListItemText>
          </MenuItem>
        )}
      </Menu>

      <ConfirmDialog
        open={openConfirmDialog}
        handleClose={() => setOpenConfirmDialog(false)}
        onConfirm={() => {
          setOpenConfirmDialog(false);
          removeCluster(cluster);
        }}
        title={t('translation|Delete Cluster')}
        description={t(
          'translation|Are you sure you want to remove the cluster "{{ clusterName }}"?',
          {
            clusterName: cluster.name,
          }
        )}
      />
    </>
  );
}

function ClusterStatus({ error }: { error?: ApiError | null }) {
  const { t } = useTranslation(['translation']);
  const theme = useTheme();

  const stateUnknown = error === undefined;
  const hasReachError = error && error.status !== 401 && error.status !== 403;

  return (
    <Box width="fit-content">
      <Box display="flex" alignItems="center" justifyContent="center">
        {hasReachError ? (
          <Icon icon="mdi:cloud-off" width={16} color={theme.palette.home.status.error} />
        ) : stateUnknown ? (
          <Icon icon="mdi:cloud-question" width={16} color={theme.palette.home.status.unknown} />
        ) : (
          <Icon
            icon="mdi:cloud-check-variant"
            width={16}
            color={theme.palette.home.status.success}
          />
        )}
        <Typography
          variant="body2"
          style={{
            marginLeft: theme.spacing(1),
            color: hasReachError
              ? theme.palette.home.status.error
              : !stateUnknown
              ? theme.palette.home.status.success
              : undefined,
          }}
        >
          {hasReachError ? error.message : stateUnknown ? '⋯' : t('translation|Active')}
        </Typography>
      </Box>
    </Box>
  );
}

export default function Home() {
  const history = useHistory();
  const clustersConf = useClustersConf() || {};
  const clusters = useMemo(() => {
    return clustersConf;
  }, [clustersConf]);

  if (!helpers.isElectron() && Object.keys(clusters).length === 1) {
    history.push(createRouteURL('cluster', { cluster: Object.keys(clusters)[0] }));
    return null;
  }
  return <HomeComponent clusters={clusters} key={Object.keys(clusters).join('')} />;
}

interface HomeComponentProps {
  clusters: { [name: string]: Cluster };
}

/**
 * Custom hook that caches the result and only returns a new result if there is a deep equality change.
 *
 * @template T - The type of the value to be memoized.
 * @param factory - The function that returns the value to be memoized.
 * @param deps - The dependencies array.
 * @returns The memoized value.
 *
 * @example
 * const memoizedValue = useDeepCompareMemo(computeExpensiveValue(a, b), [a, b]);
 */
function useDeepCompareMemo<T>(value: T, deps: any[]): T {
  const previousDepsRef = useRef<any[]>([]);
  const previousValueRef = useRef<T>();

  if (!isEqual(previousDepsRef.current, deps)) {
    previousDepsRef.current = deps;
    previousValueRef.current = value;
  }

  return previousValueRef.current as T;
}

function HomeComponent(props: HomeComponentProps) {
  const { clusters } = props;
  const customNameClusters = useMemo(() => {
    return Object.values(clusters).map(c => ({
      ...c,
      name: c.meta_data?.extensions?.headlamp_info?.customName || c.name,
    }));
  }, [clusters]);

  const customClusterNames = useMemo(() => {
    return customNameClusters.map(c => c.name);
  }, [customNameClusters]);

  const clusterList = useMemo(() => {
    return Object.values(clusters);
  }, [clusters]);

  const versionsErrors = useClustersVersion(clusterList);
  const [versions, errors] = useDeepCompareMemo(versionsErrors, [versionsErrors]);
  const warningsList = Event.useWarningList(customClusterNames);
  const warningsMap = useDeepCompareMemo(warningsList, [warningsList]);

  console.log('versions', versions);
  console.log('clusterList', clusterList);
  console.log('warningsList', warningsList);
  console.log('customClusterNames.join', customClusterNames.join('-'));

  const rendered = useMemo(() => {
    return (
      <HomePure
        customNameClusters={customNameClusters}
        customClusterNames={customClusterNames}
        versions={versions}
        errors={errors}
        warningsMap={warningsMap}
      />
    );
  }, [customClusterNames, customClusterNames, versions, errors, warningsMap]);

  return rendered;
}

type EventsPerCluster = {
  [cluster: string]: {
    warnings: Event[];
    error?: ApiError | null;
  };
};

interface HomePureProps {
  customNameClusters: Cluster[];
  customClusterNames: string[];
  versions: { [cluster: string]: { [key: string]: string } };
  errors: { [cluster: string]: ApiError | null };
  warningsMap: EventsPerCluster;
}

function HomePure(props: HomePureProps) {
  const { t } = useTranslation(['translation', 'glossary']);
  const { customNameClusters, versions, errors, warningsMap } = props;
  const maxWarnings = 50;

  function renderWarningsText(clusterName: string) {
    const numWarnings =
      (!!warningsMap[clusterName]?.error && -1) ||
      (warningsMap[clusterName]?.warnings?.length ?? -1);

    if (numWarnings === -1) {
      return '⋯';
    }
    if (numWarnings >= maxWarnings) {
      return `${maxWarnings}+`;
    }
    return numWarnings;
  }

  return (
    <PageGrid>
      <SectionBox headerProps={{ headerStyle: 'main' }} title={t('Home')}>
        <RecentClusters clusters={customNameClusters} onButtonClick={() => {}} />
      </SectionBox>
      <SectionBox
        title={
          <SectionFilterHeader
            title={t('All Clusters')}
            noNamespaceFilter
            headerStyle="subsection"
          />
        }
      >
        <ResourceTable<any>
          defaultSortingColumn={{ id: 'name', desc: false }}
          columns={[
            {
              id: 'name',
              label: t('Name'),
              getValue: cluster => cluster.name,
              render: ({ name }) => (
                <Link routeName="cluster" params={{ cluster: name }}>
                  {name}
                </Link>
              ),
            },
            {
              label: t('Status'),
              getValue: cluster => cluster.name,
              render: ({ name }) => <ClusterStatus error={errors[name]} />,
            },
            {
              label: t('Warnings'),
              getValue: ({ name }) => renderWarningsText(name),
            },
            {
              label: t('glossary|Kubernetes Version'),
              getValue: ({ name }) => versions[name]?.gitVersion || '⋯',
            },
            {
              label: '',
              getValue: () => '',
              cellProps: {
                align: 'right',
              },
              render: cluster => <ContextMenu cluster={cluster} />,
            },
          ]}
          data={customNameClusters}
          id="headlamp-home-clusters"
        />
      </SectionBox>
    </PageGrid>
  );
}
