import { Icon, InlineIcon } from '@iconify/react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Typography,
  useTheme,
} from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useClustersConf } from '../../../lib/k8s';
import { ApiError } from '../../../lib/k8s/apiProxy';
import { Cluster, KubeObject } from '../../../lib/k8s/cluster';
import Event from '../../../lib/k8s/event';
import Node from '../../../lib/k8s/node';
import Pod from '../../../lib/k8s/pod';
import { createRouteURL } from '../../../lib/router';
import { flattenClusterListItems } from '../../../lib/util';
import {
  Link,
  PageGrid,
  PercentageCircle,
  SectionBox,
  SectionHeader,
  SimpleTable,
} from '../../common';
import TooltipLight from '../../common/Tooltip/TooltipLight';

function ContextMenu({ cluster }: { cluster: string }) {
  const { t } = useTranslation('settings');
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  function handleMenuClose() {
    setAnchorEl(null);
  }

  return (
    <>
      <IconButton
        onClick={event => {
          setAnchorEl(event.currentTarget);
        }}
      >
        <Icon icon="mdi:more-vert" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => {
          handleMenuClose();
        }}
      >
        <MenuItem
          onClick={() => {
            history.push(createRouteURL('settingsCluster', { cluster }));
            handleMenuClose();
          }}
        >
          <ListItemText>{t('settings|Settings')}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

export default function MultiClusterOverview() {
  const clusters = useClustersConf();

  if (!clusters) {
    return null;
  }

  return <MultiClusterOverviewList clusters={clusters} />;
}

function MultiClusterOverviewList({ clusters }: { clusters: { [kye: string]: any } }) {
  const { t } = useTranslation(['cluster', 'frequent', 'glossary']);
  const theme = useTheme();
  const [podsPerCluster] = Pod.useListPerCluster({ clusters: Object.keys(clusters) });
  const [nodesPerCluster] = Node.useListPerCluster({ clusters: Object.keys(clusters) });
  const [eventsPerCluster, eventsErrorsPerCluster] = Event.useListPerCluster({
    clusters: Object.keys(clusters),
  });
  const history = useHistory();

  const [healthyClusters, unhealthyClusters] = React.useMemo(() => {
    const healthyClusters: string[] = [];
    const unhealthyClusters: string[] = [];

    Object.keys(clusters).forEach(cluster => {
      if (eventsErrorsPerCluster[cluster]) {
        unhealthyClusters.push(cluster);
      } else {
        healthyClusters.push(cluster);
      }
    });

    return [healthyClusters, unhealthyClusters];
  }, [clusters, eventsErrorsPerCluster]);

  function resourceSort(
    resourcesMap: { [cluster: string]: KubeObject[] | null },
    a: Cluster,
    b: Cluster
  ) {
    const aResources = resourcesMap[a.name];
    const bResources = resourcesMap[b.name];
    if (aResources && bResources) {
      return aResources.length - bResources.length;
    }
    if (aResources) {
      return -1;
    }
    if (bResources) {
      return 1;
    }
    return 0;
  }

  const numClusters = Object.keys(clusters).length;
  const flattenPods = flattenClusterListItems(podsPerCluster) || [];
  const numHealthyPods = flattenPods.map(pod => !pod.isFailed()).length || 0;

  return (
    <PageGrid>
      <SectionHeader title={t('Overview')} />
      <SectionBox p={2}>
        <Grid container justifyContent="space-around" alignItems="flex-start">
          <Grid item>
            <PercentageCircle
              title={t('frequent|Clusters & Groups')}
              data={[
                {
                  name: t('frequent|Healthy'),
                  value: Object.keys(healthyClusters).length,
                },
                {
                  name: t('frequent|Unhealthy'),
                  value: Object.keys(unhealthyClusters).length,
                  fill: theme.palette.chartStyles.defaultFillColor,
                },
              ]}
              total={numClusters}
              label={
                numClusters === 0
                  ? ''
                  : `${(1 - Object.keys(unhealthyClusters).length / numClusters) * 100.0}%`
              }
              legend={
                numClusters === 0
                  ? ''
                  : t(`cluster|{{ current }} / {{ total }} Available`, {
                      current: Object.keys(healthyClusters).length,
                      total: numClusters,
                    })
              }
            />
          </Grid>
          <Grid item>
            <PercentageCircle
              title={t('frequent|Pods')}
              data={[
                {
                  name: t('frequent|Healthy'),
                  value: numHealthyPods,
                },
                {
                  name: t('frequent|Unhealthy'),
                  value: flattenPods?.length - numHealthyPods || 0,
                  fill: theme.palette.error.main,
                },
              ]}
              total={flattenPods.length}
              label={
                flattenPods.length === 0 ? '' : `${(numHealthyPods / flattenPods.length) * 100.0}%`
              }
              legend={
                flattenPods.length === 0
                  ? ''
                  : t('cluster|{{ numReady }} / {{ numItems }} Requested', {
                      numReady: numHealthyPods,
                      numItems: flattenPods.length,
                    })
              }
            />
          </Grid>
        </Grid>
      </SectionBox>
      <SectionHeader
        title={t('All clusters')}
        titleSideActions={[
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<InlineIcon icon="mdi:group" />}
            onClick={() => {
              history.push(createRouteURL('settingsClusterGroupCreate'));
            }}
          >
            {t('frequent|Add group')}
          </Button>,
        ]}
      />
      <Paper>
        <Box px={2}>
          <SimpleTable
            askForRefreshOnDataChange={false}
            columns={[
              {
                label: t('Cluster'),
                getter: (cluster: Cluster) => (
                  <Link
                    routeName="cluster"
                    params={{ cluster: cluster.name }}
                    style={{
                      fontWeight: 'bold',
                    }}
                  >
                    {cluster.name}
                  </Link>
                ),
                sort: (a: Cluster, b: Cluster) => a.name.localeCompare(b.name),
                cellProps: {
                  style: {
                    verticalAlign: 'top',
                  },
                },
              },
              {
                label: t('frequent|Status'),
                getter: (cluster: Cluster) => (
                  <Warnings
                    events={eventsPerCluster[cluster.name]}
                    error={eventsErrorsPerCluster[cluster.name]}
                  />
                ),
                sort: (a, b) => resourceSort(eventsPerCluster, a, b),
              },
              {
                label: t('glossary|Pods'),
                getter: (cluster: Cluster) => {
                  const numHealthy =
                    podsPerCluster[cluster.name]?.filter(pod => !pod.isFailed()).length ?? -1;
                  const numErrors = (podsPerCluster[cluster.name]?.length || -1) - numHealthy;
                  return <HealthInfo numHealthy={numHealthy} numErrors={numErrors} />;
                },
                sort: (a, b) => resourceSort(podsPerCluster, a, b),
              },
              {
                label: t('glossary|Nodes'),
                getter: (cluster: Cluster) => {
                  const numHealthy =
                    nodesPerCluster[cluster.name]?.filter(node => node.isReady()).length ?? -1;
                  const numErrors = (nodesPerCluster[cluster.name]?.length || -1) - numHealthy;
                  return <HealthInfo numHealthy={numHealthy} numErrors={numErrors} />;
                },
                sort: (a, b) => resourceSort(nodesPerCluster, a, b),
              },
              {
                label: '',
                getter: (cluster: Cluster) => <ContextMenu cluster={cluster.name} />,
                cellProps: {
                  ariaLabel: t('frequent|Actions'),
                  style: {
                    width: 'fit-content',
                    textAlign: 'right',
                    paddingRight: 0,
                  },
                },
              },
            ]}
            data={Object.values(clusters)}
          />
        </Box>
      </Paper>
    </PageGrid>
  );
}

interface HealthInfoProps {
  numHealthy: number;
  numErrors: number;
}

export function HealthInfo(props: HealthInfoProps) {
  const { numHealthy, numErrors } = props;
  const { t } = useTranslation('cluster');
  const theme = useTheme();

  if (numHealthy === -1) {
    return (
      <Box pl={4}>
        <Typography variant="body2">-</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <InlineIcon
          width={24}
          icon="mdi:circle-medium"
          color={numHealthy === -1 ? theme.palette.grey[500] : theme.palette.success.main}
        />
        <Typography variant="body2">
          {t('Valid: {{ numHealthy }}', { numHealthy: numHealthy !== -1 ? numHealthy : '-' })}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center">
        <InlineIcon
          width={24}
          icon="mdi:circle-medium"
          color={numErrors === 0 ? theme.palette.grey[500] : theme.palette.error.main}
        />
        <Typography variant="body2">
          {t('Errors: {{ numErrors }}', {
            numErrors: numHealthy !== -1 && numErrors !== -1 ? numErrors : '-',
          })}
        </Typography>
      </Box>
    </Box>
  );
}

export function Warnings(props: { events: Event[] | null; error: ApiError | null }) {
  const { events, error } = props;
  const warningEvents = events?.filter(event => event.type === 'Warning') ?? null;

  return <ClusterStatus error={error} warnings={warningEvents} />;
}

function ClusterStatus({ error, warnings }: { error: ApiError | null; warnings: Event[] | null }) {
  const { t } = useTranslation('cluster');
  const theme = useTheme();

  const hasWarnings = (warnings?.length || 0) > 0;
  const stateUnknown = error === null && warnings === null;

  return (
    <Box width="fit-content">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        style={{
          backgroundColor: error
            ? theme.palette.error.light
            : hasWarnings
            ? theme.palette.warning.light
            : stateUnknown
            ? theme.palette.grey[200]
            : theme.palette.success.light,
        }}
        py={1}
        px={2}
      >
        {!!error ? (
          <Icon icon="mdi:cloud-off" width={24} color={theme.palette.error.main} />
        ) : hasWarnings ? (
          <Icon icon="mdi:cloud-alert" width={24} color={theme.palette.warning.main} />
        ) : stateUnknown ? (
          <Icon icon="mdi:cloud-question" width={24} color={theme.palette.grey[800]} />
        ) : (
          <Icon icon="mdi:cloud-check-variant" width={24} color={theme.palette.success.main} />
        )}
        <TooltipLight
          title={
            error
              ? `${error.status}: ${error.message}`
              : hasWarnings
              ? t('Last warning: {{ lastWarning }}', { lastWarning: warnings![0].reason })
              : t('Cluster is healthy')
          }
        >
          <Typography
            variant="body2"
            style={{
              marginLeft: theme.spacing(1),
              borderBottom: '1px dotted',
              borderColor: theme.palette.grey[500],
            }}
          >
            {error
              ? error.message
              : hasWarnings
              ? t('Warnings: {{ numWarnings }}', { numWarnings: warnings!.length.toString() })
              : stateUnknown
              ? t('Unknown')
              : t('Cluster is healthy')}
          </Typography>
        </TooltipLight>
      </Box>
    </Box>
  );
}
