import React from 'react';
import Namespace from '../../lib/k8s/namespace';
import { useFilterFunc } from '../../lib/util';
import { Link } from '../common';
import { StatusLabel } from '../common/Label';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function NamespacesList() {
  const [namespaces, setNamespaces] = React.useState<Namespace[] | null>(null);
  const filterFunc = useFilterFunc();

  Namespace.useApiList(setNamespaces);

  function makeStatusLabel(namespace: Namespace) {
    const status = namespace.status.phase;
    return (
      <StatusLabel status={status === 'Active' ? 'success' : 'error'}>
        {status}
      </StatusLabel>
    );
  }

  return (
    <SectionBox
      title={
        <SectionFilterHeader
          title="Namespaces"
          noNamespaceFilter
          headerStyle="main"
        />
      }
    >
      <SimpleTable
        rowsPerPage={[15, 25, 50]}
        filterFunction={filterFunc}
        columns={[
          {
            label: 'Name',
            getter: (namespace) =>
              <Link kubeObject={namespace} />
          },
          {
            label: 'Status',
            getter: makeStatusLabel
          },
          {
            label: 'Age',
            getter: (namespace) => namespace.getAge()
          },
        ]}
        data={namespaces}
      />
    </SectionBox>
  );
}
