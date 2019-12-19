import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

export default function PodList() {
  const [pods, setPods] = React.useState([]);

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
              getter: (pod) => pod.metadata.name
            },
            {
              label: 'Namespace',
              getter: (pod) => pod.metadata.namespace
            },
            {
              label: 'Status',
              getter: (pod) => pod.status.phase
            },
            {
              label: 'Age',
              getter: (pod) => timeAgo(pod.metadata.creationTimestamp)
            },
          ]}
          data={pods}
        />
      </Box>
    </Paper>
  );
}