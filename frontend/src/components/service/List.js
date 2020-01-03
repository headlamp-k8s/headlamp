import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo, useFilterFunc } from '../../lib/util';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';
import Link from '../common/Link';

export default function ServiceList() {
  const [services, setServices] = React.useState(null);
  const filterFunc = useFilterFunc();

  useConnectApi(
    api.service.list.bind(null, null, setServices),
  );

  return (
    <Paper>
      <SectionFilterHeader
        title="Services"
      />
      <SectionBox>
        <SimpleTable
          rowsPerPage={[15, 25, 50]}
          filterFunction={filterFunc}
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
              label: 'Type',
              getter: (service) => service.spec.type
            },
            {
              label: 'Cluster IP',
              getter: (service) => service.spec.clusterIP
            },
            {
              label: 'Age',
              getter: (service) => timeAgo(service.metadata.creationTimestamp)
            },
          ]}
          data={services}
        />
      </SectionBox>
    </Paper>
  );
}
