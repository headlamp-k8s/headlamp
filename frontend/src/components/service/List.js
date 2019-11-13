import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

export default function ServiceList() {
  const [servicesData, setServicesData] = React.useState([]);

  function setServices(services) {
    const data = services.map(service => {
      return {
        name: service.metadata.name,
        namespace: service.metadata.namespace,
        date: timeAgo(service.metadata.creationTimestamp),
      };
    });
    setServicesData(data);
  }

  useConnectApi(
    api.service.list.bind(null, null, setServices),
  );

  return (
    <Paper>
      <SectionHeader title="Services" />
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
              label: 'Age',
              datum: 'date',
            },
          ]}
          data={servicesData}
        />
      </Box>
    </Paper>
  );
}
