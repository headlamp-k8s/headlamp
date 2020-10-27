import React from 'react';
import StorageClass from '../../lib/k8s/storageClass';
import { useFilterFunc } from '../../lib/util';
import { Link } from '../common';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function ClassList() {
  const [storageClasses, error] = StorageClass.useList();
  const filterFunc = useFilterFunc();

  return (
    <SectionBox
      title={
        <SectionFilterHeader
          title="Storage Classes"
          noNamespaceFilter
        />
      }
    >
      <SimpleTable
        rowsPerPage={[15, 25, 50]}
        filterFunction={filterFunc}
        errorMessage={StorageClass.getErrorMessage(error)}
        columns={[
          {
            label: 'Name',
            getter: (storageClass) => <Link kubeObject={storageClass} />,
            sort: (sc1: StorageClass, sc2: StorageClass) => {
              if (sc1.metadata.name < sc2.metadata.name) {
                return -1;
              } else if (sc2.metadata.name > sc1.metadata.name) {
                return 1;
              }
              return 0;
            }
          },
          {
            label: 'Reclaim Policy',
            getter: (storageClass) => storageClass.reclaimPolicy
          },
          {
            label: 'Volume Binding Mode',
            getter: (storageClass) => storageClass.volumeBindingMode,
          },
          {
            label: 'Age',
            getter: (storageClass) => storageClass.getAge(),
            sort: (sc1: StorageClass, sc2: StorageClass) =>
              new Date(sc2.metadata.creationTimestamp).getTime() -
              new Date(sc1.metadata.creationTimestamp).getTime()
          },
        ]}
        data={storageClasses}
        defaultSortingColumn={4}
      />
    </SectionBox>
  );
}
