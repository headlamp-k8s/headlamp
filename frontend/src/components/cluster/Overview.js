import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo, useFilterFunc } from '../../lib/util';
import { makeStatusLabel } from '../common/Label';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';
import { LightTooltip } from '../common/Tooltip';
import { CpuCircularChart, MemoryCircularChart, PodsStatusCircleChart } from './Charts';

export default function Overview(props) {
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
    <Grid
      container
      direction="column"
      spacing={1}
      alignItems="stretch"
    >
      <Grid item>
        <Paper>
          <SectionHeader title="Overview" />
          <SectionBox>
            <Grid
              container
              justify="space-around"
              alignItems="flex-start"
            >
              <Grid item>
                <CpuCircularChart
                  nodes={nodes}
                  nodesMetrics={nodeMetrics}
                />
              </Grid>
              <Grid item>
                <MemoryCircularChart
                  nodes={nodes}
                  nodesMetrics={nodeMetrics}
                />
              </Grid>
              <Grid item>
                <PodsStatusCircleChart
                  pods={pods}
                />
              </Grid>
            </Grid>
          </SectionBox>
        </Paper>
      </Grid>
      <Grid item>
        <EventsSection events={events} />
      </Grid>
    </Grid>
  );
}

function EventsSection(props) {
  const { events } = props;
  const filterFunc = useFilterFunc();

  return (
    <Paper>
      <SectionFilterHeader
        title="Events"
        // Not filtering since we don't show a namespace column in the events table
        noNamespaceFilter
      />
      <SectionBox>
        <SimpleTable
          rowsPerPage={[15, 25, 50]}
          filterFunction={filterFunc}
          columns={events && [
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
                  <Box>{makeStatusLabel(event.reason, 'Synced')}</Box>
                </LightTooltip>,
            },
          ]}
          data={events}
        />
      </SectionBox>
    </Paper>
  );
}
