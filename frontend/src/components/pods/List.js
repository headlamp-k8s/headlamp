import Paper from '@material-ui/core/Paper';
import _ from 'lodash';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo, useFilterFunc } from '../../lib/util';
import { StatusLabel } from '../common/Label';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SectionHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function PodList() {
  const [pods, setPods] = React.useState(null);
  const filterFunc = useFilterFunc();

  useConnectApi(
    api.pod.list.bind(null, null, setPods),
  );

  function getRestartCount(pod) {
    return _.sumBy(pod.status.containerStatuses, container => container.restartCount);
  }

  function makeStatusLabel(pod) {
    const phase = pod.status.phase;
    let status = '';

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
    <Paper>
      <SectionHeader title="Pods" />
      <SectionBox>
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
              getter: (pod) => pod.metadata.namespace
            },
            {
              label: 'Restarts',
              getter: (pod) => getRestartCount(pod)
            },
            {
              label: 'Status',
              getter: makeStatusLabel
            },
            {
              label: 'Age',
              getter: (pod) => timeAgo(pod.metadata.creationTimestamp)
            },
          ]}
          data={pods}
        />
      </SectionBox>
    </Paper>
  );
}
