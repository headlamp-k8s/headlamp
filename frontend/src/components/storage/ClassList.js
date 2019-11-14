import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';
import {Link as RouterLink} from 'react-router-dom';

export default function ClassList() {
  const [storageClassData, setStorageClassData] = React.useState([]);

  useConnectApi(
    api.storageClass.list.bind(null, setStorageClassData),
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
              getter: (storageClass) => <Link component={RouterLink} to={`/storage/classes/${storageClass.metadata.name}`}>{storageClass.metadata.name}</Link>
            },
            {
              label: 'Reclaim Policy',
              getter: (storageClass) => storageClass.reclaimPolicy
            },
            {
              label: 'Volume Binding Mode',
              getter: (storageClass) => storageClass.volumeBindingMode,
            },
            {
              label: 'Age',
              getter: (storageClass) => timeAgo(storageClass.metadata.creationTimestamp)
            },
          ]}
          data={storageClassData}
        />
      </Box>
    </Paper>
  );
}