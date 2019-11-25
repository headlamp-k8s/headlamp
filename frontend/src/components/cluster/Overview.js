import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';
import { timeAgo } from '../../lib/util';
import { MemoryCircularChart, CpuCircularChart, PodsStatusCircleChart } from './Charts';
import { SectionBox } from '../common/SectionBox';

export default function Overview(props) {
  const [pods, setPods] = React.useState(null);
  const [eventsData, setEventsData] = React.useState(null);
  const [nodes, setNodes] = React.useState(null);
  const [nodeMetrics, setNodeMetrics] = React.useState(null);

  function setEvents(events) {
    const data = events.map(event => {
      return {
        kind: event.involvedObject.kind,
        name: event.involvedObject.name,
        time: timeAgo(event.metadata.creationTimestamp),
        reason: event.reason,
        message: event.message,
      };
    });
    setEventsData(data);
  }

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
        <Paper>
          <SectionHeader title="Events" />
          <SectionBox>
            <SimpleTable
              rowsPerPage={[15, 25, 50]}
              columns={[
                {
                  label: 'Type',
                  datum: 'kind'
                },
                {
                  label: 'Name',
                  datum: 'name',
                },
                {
                  label: 'Age',
                  datum: 'time',
                },
                {
                  label: 'Reason',
                  datum: 'reason',
                },
                {
                  label: 'Message',
                  datum: 'message',
                }
              ]}
              data={eventsData}
            />
          </SectionBox>
        </Paper>
      </Grid>
    </Grid>
  );
}