import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import Link from '../common/Link';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

export default function ServiceList() {
  const [services, setServices] = React.useState(null);

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
              getter: (service) =>
                <Link
                  routeName="service"
                  params={{
                    namespace: service.metadata.namespace,
                    name: service.metadata.name,
                  }}
                >
                  {service.metadata.name}
                </Link>
            },
            {
              label: 'Namespace',
              getter: (service) => service.metadata.namespace
            },
            {
              label: 'Age',
              getter: (service) => timeAgo(service.metadata.creationTimestamp)
            },
          ]}
          data={services}
        />
      </Box>
    </Paper>
  );
}
