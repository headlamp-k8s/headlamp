import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import { SectionBox } from '../common/SectionBox';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';
import Link from '../common/Link';

export default function IngressList() {
  const [ingresses, setIngresses] = React.useState(null);

  function getHosts(ingress) {
    return ingress.spec.rules.map(({host}) => host).join(' | ');
  }

  useConnectApi(
    api.ingress.list.bind(null, null, setIngresses),
  );

  return (
    <Paper>
      <SectionHeader title="Ingresses" />
      <SectionBox>
        <SimpleTable
          rowsPerPage={[15, 25, 50]}
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
