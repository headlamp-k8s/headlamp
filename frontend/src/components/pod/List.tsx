import _ from 'lodash';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { KubePod } from '../../lib/cluster';
import { timeAgo, useFilterFunc } from '../../lib/util';
import { SectionFilterHeader } from '../common';
import { StatusLabel, StatusLabelProps } from '../common/Label';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SimpleTable from '../common/SimpleTable';

export default function PodList() {
  const [pods, setPods] = React.useState<KubePod[] | null>(null);
  const filterFunc = useFilterFunc();

  useConnectApi(
    api.pod.list.bind(null, null, setPods),
  );

  function getRestartCount(pod: KubePod) {
    return _.sumBy(pod.status.containerStatuses, container => container.restartCount);
  }

  function makeStatusLabel(pod: KubePod) {
    const phase = pod.status.phase;
    let status: StatusLabelProps['status'] = '';

    if (phase === 'Failed') {
      status = 'error';
    } else if (phase === 'Succeeded' || phase === 'Running') {
      status = 'success';
    }

    return (
      <StatusLabel status={status}>
        {phase}
      </StatusLabel>
    );
  }

  return (
    <SectionBox
      title={
        <SectionFilterHeader
          title="Pods"
        />
      }
    >
      <SimpleTable
        rowsPerPage={[15, 25, 50]}
        filterFunction={filterFunc}
        columns={[
          {
            label: 'Name',
            getter: (pod) =>
              <Link
                routeName="pod"
                params={{
                  namespace: pod.metadata.namespace,
                  name: pod.metadata.name
                }}
              >
                {pod.metadata.name}
              </Link>
          },
          {
            label: 'Namespace',
            getter: (pod: KubePod) => pod.metadata.namespace
          },
          {
            label: 'Restarts',
            getter: (pod: KubePod) => getRestartCount(pod)
          },
          {
            label: 'Status',
            getter: makeStatusLabel
          },
          {
            label: 'Age',
            getter: (pod: KubePod) => timeAgo(pod.metadata.creationTimestamp)
          },
        ]}
        data={pods}
      />
    </SectionBox>
  );
}
