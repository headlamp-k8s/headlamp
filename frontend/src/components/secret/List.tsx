import React from 'react';
import api, { useConnectApi } from '../../lib/k8s/api';
import { timeAgo, useFilterFunc } from '../../lib/util';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function SecretList() {
  const [secrets, setSecrets] = React.useState(null);
  const filterFunc = useFilterFunc();

  useConnectApi(
    api.secret.list.bind(null, null, setSecrets),
  );

  return (
    <SectionBox
      title={
        <SectionFilterHeader
          title="Secrets"
        />
      }
    >
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
  );
}
