import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

export default function Overview(props) {
  const [pods, setPods] = React.useState(null);
  const [eventsData, setEventsData] = React.useState(null);
  const [nodes, setNodes] = React.useState(null);

  function setEvents(events) {
    const data = events.map(event => {
      console.log(event);
      return {
        kind: event.involvedObject.kind,
        name: event.involvedObject.name,
        time: event.metadata.creationTimestamp,
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
  );

  return (
    <Paper>
      <SectionHeader title="Events" />
      <Box margin={1}>
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
              label: 'Time',
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
      </Box>
    </Paper>
  );
}
