import React from 'react';
import Secret from '../../lib/k8s/secret';
import { useFilterFunc } from '../../lib/util';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function SecretList() {
  const [secrets, setSecrets] = React.useState<Secret[] | null>(null);
  const filterFunc = useFilterFunc();

  Secret.useApiList(setSecrets);

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
            getter: (secret) => <Link kubeObject={secret} />
          },
          {
            label: 'Namespace',
            getter: (secret) => secret.getNamespace()
          },
          {
            label: 'Type',
            getter: (secret) => secret.type
          },
          {
            label: 'Age',
            getter: (secret) => secret.getAge()
          },
        ]}
        data={secrets}
      />
    </SectionBox>
  );
}
