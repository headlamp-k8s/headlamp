import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';
import Link from '../common/Link';

export default function VolumeList() {
  const [volumes, setVolumes] = React.useState(null);

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
              getter: (volume) =>
                <Link
                  routeName="persistentVolume"
                  params={{
                    name: volume.metadata.name,
                  }}
                >
                  {volume.metadata.name}
                </Link>
            },
            {
              label: 'Status',
              getter: (volume) => volume.status.phase
            },
            {
              label: 'Capacity',
              getter: (volume) => volume.spec.capacity.storage
            },
            {
              label: 'Age',
              getter: (volume) => timeAgo(volume.metadata.creationTimestamp)
            },
          ]}
          data={volumes}
        />
      </Box>
    </Paper>
  );
}