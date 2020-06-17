import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import api, { useConnectApi } from '../../lib/k8s/api';
import { KubeEvent } from '../../lib/k8s/cluster';
import { timeAgo, useFilterFunc } from '../../lib/util';
import { StatusLabel } from '../common';
import { PageGrid } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';
import { LightTooltip } from '../common/Tooltip';
import { CpuCircularChart, MemoryCircularChart, PodsStatusCircleChart } from './Charts';

export default function Overview() {
  const [pods, setPods] = React.useState(null);
  const [events, setEvents] = React.useState(null);
  const [nodes, setNodes] = React.useState(null);
  const [nodeMetrics, setNodeMetrics] = React.useState(null);

  useConnectApi(
    api.pod.list.bind(null, null, setPods),
    api.event.list.bind(null, null, setEvents),
    api.node.list.bind(null, setNodes),
    api.metrics.nodes.bind(null, setNodeMetrics)
  );

  return (
    <PageGrid>
      <SectionBox py={2}>
        <Grid
          container
          justify="space-around"
          alignItems="flex-start"
        >
          <Grid item>
            <CpuCircularChart
              items={nodes}
              itemsMetrics={nodeMetrics}
            />
          </Grid>
          <Grid item>
            <MemoryCircularChart
              items={nodes}
              itemsMetrics={nodeMetrics}
            />
          </Grid>
          <Grid item>
            <PodsStatusCircleChart
              items={pods}
            />
          </Grid>
        </Grid>
      </SectionBox>
      <EventsSection events={events} />
    </PageGrid>
  );
}

const useStyles = makeStyles(theme => ({
  eventLabel: {
    [theme.breakpoints.up('md')]: {
      minWidth: '180px',
    },
  }
}));

function EventsSection(props: { events: KubeEvent[] | null }) {
  const classes = useStyles();
  const { events } = props;
  const filterFunc = useFilterFunc();

  function makeStatusLabel(event: KubeEvent) {
    return (
      <StatusLabel status={event.type === 'Normal' ? '' : 'warning'}
        className={classes.eventLabel}
      >
        {event.reason}
      </StatusLabel>
    );
  }

  return (
    <SectionBox
      title={
        <SectionFilterHeader
          title="Events"
          // Not filtering since we don't show a namespace column in the events table
          noNamespaceFilter
        />
      }
    >
      <SimpleTable
        rowsPerPage={[15, 25, 50]}
        filterFunction={filterFunc}
        columns={events ? [
          {
            label: 'Type',
            getter: event => event.involvedObject.kind
          },
          {
            label: 'Name',
            getter: event => event.involvedObject.name,
          },
          {
            label: 'Age',
            getter: event => timeAgo(event.metadata.creationTimestamp),
          },
          // @todo: Maybe the message should be shown on slide-down.
          {
            label: 'Reason',
            getter: event =>
              <LightTooltip
                title={event.message}
                interactive
              >
                <Box>{makeStatusLabel(event)}</Box>
              </LightTooltip>,
          },
        ]
          :
          []
        }
        data={events || []}
      />
    </SectionBox>
  );
}
