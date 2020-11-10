import React from 'react';
import Ingress from '../../lib/k8s/ingress';
import { timeAgo, useFilterFunc } from '../../lib/util';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function IngressList() {
  const [ingresses, error] = Ingress.useList();
  const filterFunc = useFilterFunc();

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
        errorMessage={Ingress.getErrorMessage(error)}
        columns={[
          {
            label: 'Name',
            getter: (ingress) =>
              <Link kubeObject={ingress} />,
            sort: (i1: Ingress, i2: Ingress) => {
              if (i1.metadata.name < i2.metadata.name) {
                return -1;
              } else if (i1.metadata.name > i2.metadata.name){
                return 1;
              }
              return 0;
            }
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
            getter: (ingress) => timeAgo(ingress.metadata.creationTimestamp),
            sort: (i1: Ingress, i2:Ingress) =>
              new Date(i2.metadata.creationTimestamp).getTime() -
              new Date(i1.metadata.creationTimestamp).getTime()
          },
        ]}
        data={ingresses}
        defaultSortingColumn={4}
      />
    </SectionBox>
  );
}
