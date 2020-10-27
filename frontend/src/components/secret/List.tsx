import React from 'react';
import Secret from '../../lib/k8s/secret';
import { useFilterFunc } from '../../lib/util';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function SecretList() {
  const [secrets, error] = Secret.useList();
  const filterFunc = useFilterFunc();

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
        errorMessage={Secret.getErrorMessage(error)}
        columns={[
          {
            label: 'Name',
            getter: (secret) => <Link kubeObject={secret} />,
            sort: (s1: Secret, s2: Secret) => {
              if (s1.metadata.name < s2.metadata.name) {
                return -1;
              } else if (s1.metadata.name > s2.metadata.name) {
                return 1;
              }
              return 0;
            }
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
            getter: (secret) => secret.getAge(),
            sort: (s1: Secret, s2: Secret) =>
              new Date(s2.metadata.creationTimestamp).getTime() -
              new Date(s1.metadata.creationTimestamp).getTime()
          },
        ]}
        data={secrets}
        defaultSortingColumn={4}
      />
    </SectionBox>
  );
}
