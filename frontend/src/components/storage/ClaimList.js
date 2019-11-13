import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

export default function VolumeClaimList() {
  const [volumeClaimData, setVolumeClaimData] = React.useState([]);

  function setClaims(volumeClaims) {
    const data = volumeClaims.map(volumeClaim => {
      return {
        name: volumeClaim.metadata.name,
        namespace: volumeClaim.metadata.namespace,
        status: volumeClaim.status.phase,
        class_name: volumeClaim.spec.storageClassName,
        volume_name: volumeClaim.spec.volumeName,
        capacity: volumeClaim.status.capacity.storage,
        date: timeAgo(volumeClaim.metadata.creationTimestamp),
      };
    });
    setVolumeClaimData(data);
  }

  useConnectApi(
    // @todo: use namespace for filtering.
    api.persistentVolumeClaim.list.bind(null, null, setClaims),
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
              label: 'Class Name',
              datum: 'class_name',
            },
            {
              label: 'Volume',
              datum: 'volume_name',
            },
            {
              label: 'Capacity',
              datum: 'capacity',
            },
            {
              label: 'Age',
              datum: 'date',
            },
          ]}
          data={volumeClaimData}
        />
      </Box>
    </Paper>
  );
}
