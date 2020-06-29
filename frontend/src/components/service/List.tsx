import React from 'react';
import Service from '../../lib/k8s/service';
import { useFilterFunc } from '../../lib/util';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function ServiceList() {
  const [services, setServices] = React.useState<Service | null>(null);
  const filterFunc = useFilterFunc();

  Service.useApiList(setServices);

  return (
    <SectionBox
      title={
        <SectionFilterHeader
          title="Services"
        />
      }
    >
      <SimpleTable
        rowsPerPage={[15, 25, 50]}
        filterFunction={filterFunc}
        columns={[
          {
            label: 'Name',
            getter: (service) => <Link kubeObject={service} />
          },
          {
            label: 'Namespace',
            getter: (service) => service.getNamespace()
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
            getter: (service) => service.getAge()
          },
        ]}
        data={services}
      />
    </SectionBox>
  );
}
