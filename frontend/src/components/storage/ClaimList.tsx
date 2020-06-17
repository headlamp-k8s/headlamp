import React from 'react';
import api, { useConnectApi } from '../../lib/k8s/api';
import { KubePersistentVolumeClaim } from '../../lib/k8s/cluster';
import { timeAgo, useFilterFunc } from '../../lib/util';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SimpleTable from '../common/SimpleTable';

export default function VolumeClaimList() {
  const [volumeClaim, setVolumeClaim] = React.useState<KubePersistentVolumeClaim[] | null>(null);
  const filterFunc = useFilterFunc();

  useConnectApi(
    // @todo: use namespace for filtering.
    api.persistentVolumeClaim.list.bind(null, null, setVolumeClaim),
  );

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
            getter: (volumeClaim) =>
              <Link
                routeName="persistentVolumeClaim"
                params={{
                  namespace: volumeClaim.metadata.namespace,
                  name: volumeClaim.metadata.name
                }}
              >
                {volumeClaim.metadata.name}
              </Link>
          },
          {
            label: 'Namespace',
            getter: (volumeClaim) => volumeClaim.metadata.namespace
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
            getter: (volumeClaim) => timeAgo(volumeClaim.metadata.creationTimestamp)
          },
        ]}
        data={volumeClaim}
      />
    </SectionBox>
  );
}
