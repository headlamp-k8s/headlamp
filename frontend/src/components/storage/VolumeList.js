import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

export default function VolumeList() {
  const [volumesData, setVolumesData] = React.useState([]);

  function setVolumes(volumes) {
    const data = volumes.map(volume => {
      return {
        name: volume.metadata.name,
        status: volume.status.phase,
        capacity: volume.spec.capacity.storage,
        date: timeAgo(volume.metadata.creationTimestamp),
      };
    });
    setVolumesData(data);
  }

  useConnectApi(
    api.persistentVolume.list.bind(null, setVolumes),
  );

  return (
    <Paper>
      <SectionHeader title="Persistent Volumes" />
      <Box margin={1}>
        <SimpleTable
          rowsPerPage={[15, 25, 50]}
          columns={[
            {
              label: 'Name',
              datum: 'name'
            },
            {
              label: 'Status',
              datum: 'status',
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
          data={volumesData}
        />
      </Box>
    </Paper>
  );
}
