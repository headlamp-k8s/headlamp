import React from 'react';
import api, { useConnectApi } from '../../lib/k8s/api';
import { KubeIngress } from '../../lib/k8s/cluster';
import { timeAgo, useFilterFunc } from '../../lib/util';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function IngressList() {
  const [ingresses, setIngresses] = React.useState<KubeIngress[] | null>(null);
  const filterFunc = useFilterFunc();

  function getHosts(ingress: KubeIngress) {
    return ingress.spec.rules.map(({host}) => host).join(' | ');
  }

  useConnectApi(
    api.ingress.list.bind(null, null, setIngresses),
  );

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
              <Link
                routeName="ingress"
                params={{namespace: ingress.metadata.namespace, name: ingress.metadata.name}}
              >
                {ingress.metadata.name}
              </Link>
          },
          {
            label: 'Namespace',
            getter: (ingress) => ingress.metadata.namespace
          },
          {
            label: 'Hosts',
            getter: (ingress) => getHosts(ingress)
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
