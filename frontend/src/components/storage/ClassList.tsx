import React from 'react';
import StorageClass from '../../lib/k8s/storageClass';
import { useFilterFunc } from '../../lib/util';
import { Link } from '../common';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function ClassList() {
  const [storageClassData, setStorageClassData] = React.useState<StorageClass[] | null>(null);
  const filterFunc = useFilterFunc();

  StorageClass.useApiList(setStorageClassData);

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
        columns={[
          {
            label: 'Name',
            getter: (storageClass) => <Link kubeObject={storageClass} />
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
            getter: (storageClass) => storageClass.getAge()
          },
        ]}
        data={storageClassData}
      />
    </SectionBox>
  );
}
