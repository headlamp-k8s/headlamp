import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

export default function VolumeClaimList() {
  const [volumeClaim, setVolumeClaim] = React.useState([]);

  useConnectApi(
    // @todo: use namespace for filtering.
    api.persistentVolumeClaim.list.bind(null, null, setVolumeClaim),
  );

  return (
    <Paper>
      <SectionHeader title="Volume Claims" />
      <Box margin={1}>
        <SimpleTable
          rowsPerPage={[15, 25, 50]}
          columns={[
            {
              label: 'Name',
              getter: (volumeClaim) => volumeClaim.metadata.name
            },
            {
              label: 'Namespace',
              getter: (volumeClaim) => volumeClaim.metadata.namespace
            },
            {
              label: 'Status',
              getter: (volumeClaim) => volumeClaim.status.phase
            },
            {
              label: 'Class Name',
              getter: (volumeClaim) => volumeClaim.spec.storageClassName
            },
            {
              label: 'Volume',
              getter: (volumeClaim) => volumeClaim.spec.volumeName
            },
            {
              label: 'Capacity',
              getter: (volumeClaim) => volumeClaim.status.capacity.storage
            },
            {
              label: 'Age',
              getter: (volumeClaim) => timeAgo(volumeClaim.metadata.creationTimestamp)
            },
          ]}
          data={volumeClaim}
        />
      </Box>
    </Paper>
  );
}