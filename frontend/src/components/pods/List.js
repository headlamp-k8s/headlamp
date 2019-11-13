import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

export default function PodList() {
  const [podsData, setPodsData] = React.useState([]);

  function setPods(pods) {
    const data = pods.map(pod => {
      return {
        name: pod.metadata.name,
        namespace: pod.metadata.namespace,
        status: pod.status.phase,
        date: timeAgo(pod.metadata.creationTimestamp),
      };
    });
    setPodsData(data);
  }

  useConnectApi(
    api.pod.list.bind(null, null, setPods),
  );

  return (
    <Paper>
      <SectionHeader title="Pods" />
      <Box margin={1}>
        <SimpleTable
          rowsPerPage={[15, 25, 50]}
          columns={[
            {
              label: 'Name',
              datum: 'name'
            },
            {
              label: 'Namespace',
              datum: 'namespace',
            },
            {
              label: 'Status',
              datum: 'status',
            },
            {
              label: 'Age',
              datum: 'date',
            },
          ]}
          data={podsData}
        />
      </Box>
    </Paper>
  );
}