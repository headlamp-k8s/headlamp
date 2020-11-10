import React from 'react';
import Service from '../../lib/k8s/service';
import { useFilterFunc } from '../../lib/util';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function ServiceList() {
  const [services, error] = Service.useList();
  const filterFunc = useFilterFunc();

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
        errorMessage={Service.getErrorMessage(error)}
        columns={[
          {
            label: 'Name',
            getter: (service) => <Link kubeObject={service} />,
            sort: (s1: Service, s2: Service) => {
              if (s1.metadata.name < s2.metadata.name) {
                return -1;
              } else if (s1.metadata.name > s2.metadata.name) {
                return 1;
              }
              return 0;
            }
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
            getter: (service) => service.getAge(),
            sort: (s1: Service, s2: Service) =>
              new Date(s2.metadata.creationTimestamp).getTime() -
              new Date(s1.metadata.creationTimestamp).getTime()
          },
        ]}
        data={services}
        defaultSortingColumn={5}
      />
    </SectionBox>
  );
}
