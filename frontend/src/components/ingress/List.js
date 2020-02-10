import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo, useFilterFunc } from '../../lib/util';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function IngressList() {
  const [ingresses, setIngresses] = React.useState(null);
  const filterFunc = useFilterFunc();

  function getHosts(ingress) {
    return ingress.spec.rules.map(({host}) => host).join(' | ');
  }

  useConnectApi(
    api.ingress.list.bind(null, null, setIngresses),
  );

  return (
    <Paper>
      <SectionFilterHeader
        title="Ingresses"
      />
      <SectionBox>
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
    </Paper>
  );
}
