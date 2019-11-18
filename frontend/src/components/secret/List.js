import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';
import Link from '../common/Link';

export default function SecretList() {
  const [secrets, setSecrets] = React.useState(null);

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
              getter: (secret) =>
                <Link
                  routeName="secret"
                  params={{
                    namespace: secret.metadata.namespace,
                    name: secret.metadata.name,
                  }}
                >
                  {secret.metadata.name}
                </Link>
            },
            {
              label: 'Namespace',
              getter: (secret) => secret.metadata.namespace
            },
            {
              label: 'Type',
              getter: (secret) => secret.type
            },
            {
              label: 'Age',
              getter: (secret) => timeAgo(secret.metadata.creationTimestamp)
            },
          ]}
          data={secrets}
        />
      </Box>
    </Paper>
  );
}