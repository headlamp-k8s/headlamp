import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Event from '../../lib/k8s/event';
import Node from '../../lib/k8s/node';
import Pod from '../../lib/k8s/pod';
import { timeAgo, useFilterFunc } from '../../lib/util';
import { StatusLabel } from '../common';
import Empty from '../common/EmptyContent';
import { PageGrid } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';
import { LightTooltip } from '../common/Tooltip';
import { CpuCircularChart, MemoryCircularChart, PodsStatusCircleChart } from './Charts';

export default function Overview() {
  const [pods, setPods] = React.useState<Pod[] | null>(null);
  const [nodes, setNodes] = React.useState<Node[] | null>(null);
  const { t } = useTranslation('cluster');

  Pod.useApiList(setPods);
  Node.useApiList(setNodes);

  const [nodeMetrics, metricsError] = Node.useMetrics();

  const noMetrics = metricsError?.status === 404;
  const noPermissions = metricsError?.status === 403;

  return (
    <PageGrid>
      <SectionBox py={2} mt={[4, 0, 0]}>
        {noPermissions ? (
          <Empty color="error">{t('auth|No permissions to list pods.')}</Empty>
        ) : (
          <Grid container justify="space-around" alignItems="flex-start">
            <Grid item>
              <CpuCircularChart items={nodes} itemsMetrics={nodeMetrics} noMetrics={noMetrics} />
            </Grid>
            <Grid item>
              <MemoryCircularChart items={nodes} itemsMetrics={nodeMetrics} noMetrics={noMetrics} />
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
  const classes = useStyles();
  const filterFunc = useFilterFunc();
  const [events, error] = Event.useList();
  const { t } = useTranslation('glossary');

  function makeStatusLabel(event: Event) {
    return (
      <StatusLabel status={event.type === 'Normal' ? '' : 'warning'} className={classes.eventLabel}>
        {event.reason}
      </StatusLabel>
    );
  }

  return (
    <SectionBox title={<SectionFilterHeader title={t('Events')} />}>
      <SimpleTable
        rowsPerPage={[15, 25, 50]}
        filterFunction={filterFunc}
        errorMessage={Event.getErrorMessage(error)}
        columns={
          events
            ? [
                {
                  label: t('Type'),
                  getter: event => event.involvedObject.kind,
                  sort: true,
                },
                {
                  label: t('frequent|Name'),
                  getter: event => event.involvedObject.name,
                  sort: true,
                },
                {
                  label: t('glossary|Namespace'),
                  getter: event => event.metadata.namespace || '-',
                },
                // @todo: Maybe the message should be shown on slide-down.
                {
                  label: t('Reason'),
                  getter: event => (
                    <LightTooltip title={event.message} interactive>
                      <Box>{makeStatusLabel(event)}</Box>
                    </LightTooltip>
                  ),
                },
                {
                  label: t('frequent|Age'),
                  getter: event => timeAgo(event.metadata.creationTimestamp),
                  sort: (e1: Event, e2: Event) =>
                    new Date(e2.metadata.creationTimestamp).getTime() -
                    new Date(e1.metadata.creationTimestamp).getTime(),
                },
              ]
            : []
        }
        data={events}
        defaultSortingColumn={3}
      />
    </SectionBox>
  );
}
