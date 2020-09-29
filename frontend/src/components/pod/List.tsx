import _ from 'lodash';
import React from 'react';
import Pod from '../../lib/k8s/pod';
import { useFilterFunc } from '../../lib/util';
import { SectionFilterHeader } from '../common';
import { StatusLabel, StatusLabelProps } from '../common/Label';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SimpleTable from '../common/SimpleTable';

export default function PodList() {
  const [pods, error] = Pod.useList();
  const filterFunc = useFilterFunc();

  function getRestartCount(pod: Pod) {
    return _.sumBy(pod.status.containerStatuses, container => container.restartCount);
  }

  function makeStatusLabel(pod: Pod) {
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
        errorMessage={Pod.getErrorMessage(error)}
        columns={[
          {
            label: 'Name',
            getter: (pod) => <Link kubeObject={pod} />
          },
          {
            label: 'Namespace',
            getter: (pod: Pod) => pod.getNamespace()
          },
          {
            label: 'Restarts',
            getter: (pod: Pod) => getRestartCount(pod)
          },
          {
            label: 'Status',
            getter: makeStatusLabel
          },
          {
            label: 'Age',
            getter: (pod: Pod) => pod.getAge()
          },
        ]}
        data={pods}
      />
    </SectionBox>
  );
}
