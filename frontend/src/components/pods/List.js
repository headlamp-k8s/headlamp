import Paper from '@material-ui/core/Paper';
import _ from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import api, { useConnectApi } from '../../lib/api';
import { filterResource, timeAgo } from '../../lib/util';
import { StatusLabel } from '../common/Label';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SectionHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function PodList() {
  const [pods, setPods] = React.useState(null);
  const filter = useSelector(state => state.filter);

  useConnectApi(
    api.pod.list.bind(null, null, setPods),
  );

  function getRestartCount(pod) {
    return _.sumBy(pod.status.containerStatuses, container => container.restartCount);
  }

  function makeStatusLabel(pod) {
    const status = pod.status.phase;
    return (
      <StatusLabel status={status == 'Running' ? 'success' : 'error'}>
        {status}
      </StatusLabel>
    );
  }

  return (
    <Paper>
      <SectionHeader title="Pods" />
      <SectionBox>
        <SimpleTable
          rowsPerPage={[15, 25, 50]}
          filterFunction={item => filterResource(item, filter)}
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
