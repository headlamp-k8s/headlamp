import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

export default function ServiceAccountList() {
  const [serviceAccounts, setServiceAccounts] = React.useState([]);

  useConnectApi(
    api.serviceAccount.list.bind(null, null, setServiceAccounts),
  );

  return (
    <Paper>
      <SectionHeader title="Service Accounts" />
      <Box margin={1}>
        <SimpleTable
          rowsPerPage={[15, 25, 50]}
          columns={[
            {
              label: 'Name',
              getter: (serviceAccount) => serviceAccount.metadata.name
            },
            {
              label: 'Namespace',
              getter: (serviceAccount) => serviceAccount.metadata.namespace
            },
            {
              label: 'Age',
              getter: (serviceAccount) => timeAgo(serviceAccount.metadata.creationTimestamp)
            },
          ]}
          data={serviceAccounts}
        />
      </Box>
    </Paper>
  );
}