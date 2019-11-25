import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

export default function SecretList() {
  const [secrets, setSecrets] = React.useState(null);

  useConnectApi(
    api.secret.list.bind(null, null, setSecrets),
  );

  return (
    <Paper>
      <SectionHeader title="Secrets" />
      <SectionBox>
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
      </SectionBox>
    </Paper>
  );
}
