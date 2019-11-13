import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

export default function IngressList() {
  const [ingressesData, setIngressesData] = React.useState([]);

  function setIngresses(ingresses) {
    const data = ingresses.map(ingress => {
      return {
        name: ingress.metadata.name,
        namespace: ingress.metadata.namespace,
        hosts: getHosts(ingress),
        date: timeAgo(ingress.metadata.creationTimestamp),
      };
    });
    setIngressesData(data);
  }

  function getHosts(ingress) {
    return ingress.spec.rules.map(({host}) => host).join(' | ');
  }

  useConnectApi(
    api.ingress.list.bind(null, null, setIngresses),
  );

  return (
    <Paper>
      <SectionHeader title="Ingresses" />
      <Box margin={1}>
        <SimpleTable
          rowsPerPage={[15, 25, 50]}
          columns={[
            {
              label: 'Name',
              datum: 'name'
            },
            {
              label: 'Namespace',
              datum: 'namespace',
            },
            {
              label: 'Hosts',
              datum: 'hosts',
            },
            {
              label: 'Age',
              datum: 'date',
            },
          ]}
          data={ingressesData}
        />
      </Box>
    </Paper>
  );
}
