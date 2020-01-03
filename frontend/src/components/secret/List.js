import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo, useFilterFunc } from '../../lib/util';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';
import Link from '../common/Link';

export default function SecretList() {
  const [secrets, setSecrets] = React.useState(null);
  const filterFunc = useFilterFunc();

  useConnectApi(
    api.secret.list.bind(null, null, setSecrets),
  );

  return (
    <Paper>
      <SectionFilterHeader
        title="Secrets"
      />
      <SectionBox>
        <SimpleTable
          rowsPerPage={[15, 25, 50]}
          filterFunction={filterFunc}
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
