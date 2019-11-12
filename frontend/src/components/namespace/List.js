import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

export default function NamespacesList() {
  const [namespacesData, setNamespacesData] = React.useState([]);

  function setNamespaces(namespaces) {
    const data = namespaces.map(namespace => {
      return {
        name: namespace.metadata.name,
        status: namespace.status.phase,
        date: timeAgo(namespace.metadata.creationTimestamp),
      };
    });
    setNamespacesData(data);
  }

  useConnectApi(
    api.namespace.list.bind(null, setNamespaces),
  );

  return (
    <Paper>
      <SectionHeader title="Namespaces" />
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
              label: 'Age',
              datum: 'date',
            },
          ]}
          data={namespacesData}
        />
      </Box>
    </Paper>
  );
}