import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

export default function SecretList() {
  const [secretsData, setSecretsData] = React.useState([]);

  function setSecrets(secrets) {
    const data = secrets.map(secret => {
      return {
        name: secret.metadata.name,
        namespace: secret.metadata.namespace,
        type: secret.type,
        date: timeAgo(secret.metadata.creationTimestamp),
      };
    });
    setSecretsData(data);
  }

  useConnectApi(
    api.secret.list.bind(null, null, setSecrets),
  );

  return (
    <Paper>
      <SectionHeader title="Secrets" />
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
              label: 'Type',
              datum: 'type',
            },
            {
              label: 'Age',
              datum: 'date',
            },
          ]}
          data={secretsData}
        />
      </Box>
    </Paper>
  );
}
