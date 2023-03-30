import { FormControlLabel, Switch } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import Event, { KubeEvent } from '../../lib/k8s/event';
import Node from '../../lib/k8s/node';
import Pod from '../../lib/k8s/pod';
import { parseCpu, parseRam, TO_GB, TO_ONE_CPU } from '../../lib/units';
import { getClusterGroup, useFilterFunc } from '../../lib/util';
import { setSearchFilter } from '../../redux/actions/actions';
import { Link, StatusLabel } from '../common';
import Empty from '../common/EmptyContent';
import { PageGrid } from '../common/Resource';
import ResourceTable from '../common/Resource/ResourceTable';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import { LightTooltip } from '../common/Tooltip';
import { CpuCircularChart, MemoryCircularChart, PodsStatusCircleChart } from './Charts';
import { ClusterGroupErrorMessage } from './ClusterGroupErrorMessage';

export default function Overview() {
  const { t } = useTranslation('cluster');
  const [pods] = Pod.useList();
  const [nodes] = Node.useList();
  const clusters = getClusterGroup();

  const [nodeMetrics, metricsErrors] = Node.useMetricsPerCluster();

  function checkAllClustersError(errNum: number) {
    const errorsWith404 = clusters.filter(cluster => metricsErrors[cluster]?.status === errNum);
    return errorsWith404.length === clusters.length;
  }

  const noMetrics = React.useMemo(() => {
    return checkAllClustersError(404);
  }, [clusters, metricsErrors]);

  const noPermissions = React.useMemo(() => {
    return checkAllClustersError(403);
  }, [clusters, metricsErrors]);

  const nodeMetricsAggregated = React.useMemo(() => {
    const aggregated = [];
    for (const items of Object.values(nodeMetrics)) {
      aggregated.push(...items);
    }
    return aggregated;
  }, [nodeMetrics]);

  function getTotalCpu() {
    let cpuAggregated = 0;
    for (const node of nodes || []) {
      cpuAggregated += parseCpu(node.status!.capacity.cpu);
    }

    return cpuAggregated / TO_ONE_CPU;
  }

  function getTotalMemory() {
    let memoryAggregated = 0;
    for (const node of nodes || []) {
      memoryAggregated += parseRam(node.status!.capacity.memory);
    }

    return memoryAggregated / TO_GB;
  }

  const hasErrorsAndMetrics = React.useMemo(() => {
    return Object.keys(metricsErrors).length > 0 && !noMetrics;
  }, [metricsErrors, noMetrics]);

  return (
    <PageGrid>
      {hasErrorsAndMetrics && (
        <Box mb={2}>
          <ClusterGroupErrorMessage clusters={metricsErrors} />
        </Box>
      )}
      <SectionBox py={2} mt={[4, 0, 0]}>
        {noPermissions ? (
          <Empty color="error">{t('auth|No permissions to list pods.')}</Empty>
        ) : (
          <Grid container justifyContent="space-around" alignItems="flex-start">
            <Grid item>
              <CpuCircularChart
                items={nodes}
                itemsMetrics={nodeMetricsAggregated}
                noMetrics={noMetrics}
                resourceAvailableGetter={getTotalCpu}
              />
            </Grid>
            <Grid item>
              <MemoryCircularChart
                items={nodes}
                itemsMetrics={nodeMetricsAggregated}
                noMetrics={noMetrics}
                resourceAvailableGetter={getTotalMemory}
              />
            </Grid>
            <Grid item>
              <PodsStatusCircleChart items={pods} />
            </Grid>
          </Grid>
        )}
      </SectionBox>
      <EventsSection />
    </PageGrid>
  );
}

const useStyles = makeStyles(theme => ({
  eventLabel: {
    [theme.breakpoints.up('md')]: {
      minWidth: '180px',
    },
  },
}));

function EventsSection() {
  const EVENT_WARNING_SWITCH_FILTER_STORAGE_KEY = 'EVENT_WARNING_SWITCH_FILTER_STORAGE_KEY';
  const classes = useStyles();
  const { t } = useTranslation('glossary');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const eventsFilter = queryParams.get('eventsFilter');
  const dispatch = useDispatch();
  const filterFunc = useFilterFunc(['.jsonData.involvedObject.kind']);
  const [isWarningEventSwitchChecked, setIsWarningEventSwitchChecked] = React.useState(
    Boolean(localStorage.getItem(EVENT_WARNING_SWITCH_FILTER_STORAGE_KEY))
  );

  const warningActionFilterFunc = (event: KubeEvent) => {
    if (!filterFunc(event)) {
      return false;
    }

    if (isWarningEventSwitchChecked) {
      return event.jsonData.type === 'Warning';
    }

    // Return true because if we reach this point, it means we're only filtering by
    // the default filterFunc (and its result was 'true').
    return true;
  };

  React.useEffect(() => {
    if (!eventsFilter) {
      return;
    }
    // we want to consider search by id
    dispatch(setSearchFilter(eventsFilter));
  }, [eventsFilter]);

  function makeStatusLabel(event: Event) {
    return (
      <StatusLabel status={event.type === 'Normal' ? '' : 'warning'} className={classes.eventLabel}>
        {event.reason}
      </StatusLabel>
    );
  }

  function makeObjectLink(event: Event) {
    const obj = event.involvedObjectInstance;
    if (!!obj) {
      return <Link kubeObject={obj} />;
    }

    return event.involvedObject.name;
  }

  return (
    <SectionBox
      title={
        <SectionFilterHeader
          title={t('Events')}
          titleSideActions={[
            <FormControlLabel
              checked={isWarningEventSwitchChecked}
              label={t('Warnings')}
              control={<Switch color="primary" />}
              onChange={(event, checked) => {
                localStorage.setItem(EVENT_WARNING_SWITCH_FILTER_STORAGE_KEY, checked.toString());
                setIsWarningEventSwitchChecked(checked);
              }}
            />,
          ]}
        />
      }
    >
      <ResourceTable
        resourceClass={Event}
        columns={[
          'cluster',
          {
            label: t('Type'),
            getter: event => event.involvedObject.kind,
            sort: true,
          },
          {
            label: t('frequent|Name'),
            getter: event => makeObjectLink(event),
            cellProps: {
              scope: 'row',
              component: 'th',
            },
            sort: true,
          },
          'namespace',
          // @todo: Maybe the message should be shown on slide-down.
          {
            label: t('Reason'),
            getter: event => (
              <LightTooltip title={event.message} interactive>
                <Box>{makeStatusLabel(event)}</Box>
              </LightTooltip>
            ),
            sort: (e1: Event, e2: Event) => e1.reason.localeCompare(e2.reason),
          },
          'age',
        ]}
        filterFunction={warningActionFilterFunc}
      />
    </SectionBox>
  );
}
