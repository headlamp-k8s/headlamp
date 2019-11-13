import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

export default function ClassList() {
  const [storageClassData, setStorageClassData] = React.useState([]);

  function setClasses(storageClasses) {
    const data = storageClasses.map(storageClass => {
      return {
        name: storageClass.metadata.name,
        reclaim_policy: storageClass.reclaimPolicy,
        binding_mode: storageClass.volumeBindingMode,
        date: timeAgo(storageClass.metadata.creationTimestamp),
      };
    });
    setStorageClassData(data);
  }

  useConnectApi(
    api.storageClass.list.bind(null, setClasses),
  );

  return (
    <Paper>
      <SectionHeader title="Storage Classes" />
      <Box margin={1}>
        <SimpleTable
          rowsPerPage={[15, 25, 50]}
          columns={[
            {
              label: 'Name',
              datum: 'name'
            },
            {
              label: 'Reclaim Policy',
              datum: 'reclaim_policy',
            },
            {
              label: 'Volume Binding Mode',
              datum: 'binding_mode',
            },
            {
              label: 'Age',
              datum: 'date',
            },
          ]}
          data={storageClassData}
        />
      </Box>
    </Paper>
  );
}
