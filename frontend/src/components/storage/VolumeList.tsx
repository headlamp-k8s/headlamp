import React from 'react';
import PersistentVolume from '../../lib/k8s/persistentVolume';
import { useFilterFunc } from '../../lib/util';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function VolumeList() {
  const [volumes, setVolumes] = React.useState<PersistentVolume[] | null>(null);
  const filterFunc = useFilterFunc();

  PersistentVolume.useApiList(setVolumes);

  return (
    <SectionBox
      title={
        <SectionFilterHeader
          title="Persistent Volumes"
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
            getter: (volume) => <Link kubeObject={volume} />
          },
          {
            label: 'Status',
            getter: (volume) => volume.status.phase
          },
          {
            label: 'Capacity',
            getter: (volume) => volume.spec.capacity.storage
          },
          {
            label: 'Age',
            getter: (volume) => volume.getAge()
          },
        ]}
        data={volumes}
      />
    </SectionBox>
  );
}
