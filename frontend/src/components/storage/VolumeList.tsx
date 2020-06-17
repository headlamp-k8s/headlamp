import React from 'react';
import api, { useConnectApi } from '../../lib/k8s/api';
import { KubePersistentVolume } from '../../lib/k8s/cluster';
import { timeAgo, useFilterFunc } from '../../lib/util';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function VolumeList() {
  const [volumes, setVolumes] = React.useState<KubePersistentVolume[] | null>(null);
  const filterFunc = useFilterFunc();

  useConnectApi(
    api.persistentVolume.list.bind(null, setVolumes),
  );

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
            getter: (volume) =>
              <Link
                routeName="persistentVolume"
                params={{
                  name: volume.metadata.name,
                }}
              >
                {volume.metadata.name}
              </Link>
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
            getter: (volume) => timeAgo(volume.metadata.creationTimestamp)
          },
        ]}
        data={volumes}
      />
    </SectionBox>
  );
}
