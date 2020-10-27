import React from 'react';
import PersistentVolumeClaim from '../../lib/k8s/persistentVolumeClaim';
import { useFilterFunc } from '../../lib/util';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SimpleTable from '../common/SimpleTable';

export default function VolumeClaimList() {
  const [volumeClaim, error] = PersistentVolumeClaim.useList();
  const filterFunc = useFilterFunc();

  return (
    <SectionBox
      title="Volume Claims"
      headerProps={{
        headerStyle: 'main',
      }}
    >
      <SimpleTable
        rowsPerPage={[15, 25, 50]}
        filterFunction={filterFunc}
        errorMessage={PersistentVolumeClaim.getErrorMessage(error)}
        columns={[
          {
            label: 'Name',
            getter: (volumeClaim) => <Link kubeObject={volumeClaim} />,
            sort: (v1: PersistentVolumeClaim, v2: PersistentVolumeClaim) => {
              if (v1.metadata.name < v2.metadata.name) {
                return -1;
              } else if (v1.metadata.name > v2.metadata.name) {
                return 1;
              }
              return 0;
            }
          },
          {
            label: 'Namespace',
            getter: (volumeClaim) => volumeClaim.getNamespace()
          },
          {
            label: 'Status',
            getter: (volumeClaim) => volumeClaim.status.phase
          },
          {
            label: 'Class Name',
            getter: (volumeClaim) => volumeClaim.spec.storageClassName
          },
          {
            label: 'Volume',
            getter: (volumeClaim) => volumeClaim.spec.volumeName
          },
          {
            label: 'Capacity',
            getter: (volumeClaim) => volumeClaim.status.capacity?.storage
          },
          {
            label: 'Age',
            getter: (volumeClaim) => volumeClaim.getAge(),
            sort: (v1: PersistentVolumeClaim, v2: PersistentVolumeClaim) =>
              new Date(v2.metadata.creationTimestamp).getTime() -
              new Date(v1.metadata.creationTimestamp).getTime()
          },
        ]}
        data={volumeClaim}
        defaultSortingColumn={7}
      />
    </SectionBox>
  );
}
