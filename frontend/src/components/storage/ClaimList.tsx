import React from 'react';
import PersistentVolumeClaim from '../../lib/k8s/persistentVolumeClaim';
import { useFilterFunc } from '../../lib/util';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SimpleTable from '../common/SimpleTable';

export default function VolumeClaimList() {
  const [volumeClaim, setVolumeClaim] = React.useState<PersistentVolumeClaim[] | null>(null);
  const filterFunc = useFilterFunc();

  PersistentVolumeClaim.useApiList(setVolumeClaim);

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
        columns={[
          {
            label: 'Name',
            getter: (volumeClaim) => <Link kubeObject={volumeClaim} />
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
            getter: (volumeClaim) => volumeClaim.getAge()
          },
        ]}
        data={volumeClaim}
      />
    </SectionBox>
  );
}
