import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

export default function ServiceAccountList() {
  const [serviceAccountsData, setServiceAccountsData] = React.useState([]);

  function setServiceAccounts(serviceAccounts) {
    const data = serviceAccounts.map(serviceAccount => {
      return {
        name: serviceAccount.metadata.name,
        namespace: serviceAccount.metadata.namespace,
        date: timeAgo(serviceAccount.metadata.creationTimestamp),
      };
    });
    setServiceAccountsData(data);
  }

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
              datum: 'name'
            },
            {
              label: 'Namespace',
              datum: 'namespace',
            },
            {
              label: 'Age',
              datum: 'date',
            },
          ]}
          data={serviceAccountsData}
        />
      </Box>
    </Paper>
  );
}
