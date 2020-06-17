import React from 'react';
import api, { useConnectApi } from '../../lib/k8s/api';
import { KubeStorageClass } from '../../lib/k8s/cluster';
import { timeAgo, useFilterFunc } from '../../lib/util';
import { Link } from '../common';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function ClassList() {
  const [storageClassData, setStorageClassData] = React.useState<KubeStorageClass[] | null>(null);
  const filterFunc = useFilterFunc();

  useConnectApi(
    api.storageClass.list.bind(null, setStorageClassData),
  );

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
            getter: (storageClass) =>
              <Link
                routeName="storageClassDetails"
                params={{
                  name: storageClass.metadata.name,
                }}
              >
                {storageClass.metadata.name}
              </Link>
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
            getter: (storageClass) => timeAgo(storageClass.metadata.creationTimestamp)
          },
        ]}
        data={storageClassData}
      />
    </SectionBox>
  );
}
