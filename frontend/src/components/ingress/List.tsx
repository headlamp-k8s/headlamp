import React from 'react';
import Ingress from '../../lib/k8s/ingress';
import { timeAgo, useFilterFunc } from '../../lib/util';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function IngressList() {
  const [ingresses, setIngresses] = React.useState<Ingress[] | null>(null);
  const filterFunc = useFilterFunc();

  Ingress.useApiList(setIngresses);

  return (
    <SectionBox
      title={
        <SectionFilterHeader
          title="Ingresses"
        />
      }
    >
      <SimpleTable
        rowsPerPage={[15, 25, 50]}
        filterFunction={filterFunc}
        columns={[
          {
            label: 'Name',
            getter: (ingress) =>
              <Link kubeObject={ingress} />
          },
          {
            label: 'Namespace',
            getter: (ingress) => ingress.getNamespace()
          },
          {
            label: 'Hosts',
            getter: (ingress) => ingress.getHosts()
          },
          {
            label: 'Age',
            getter: (ingress) => timeAgo(ingress.metadata.creationTimestamp)
          },
        ]}
        data={ingresses}
      />
    </SectionBox>
  );
}
