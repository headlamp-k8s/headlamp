import Paper from '@material-ui/core/Paper';
import _ from 'lodash';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

export default function PodList() {
  const [pods, setPods] = React.useState(null);

  useConnectApi(
    api.pod.list.bind(null, null, setPods),
  );

  function getRestartCount(pod) {
    return _.sumBy(pod.status.containerStatuses, container => container.restartCount);
  }

  return (
    <Paper>
      <SectionHeader title="Pods" />
      <SectionBox>
        <SimpleTable
          rowsPerPage={[15, 25, 50]}
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
              getter: (pod) => pod.status.phase
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
