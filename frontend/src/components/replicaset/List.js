import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo, useFilterFunc } from '../../lib/util';
import { ResourceLink } from '../common/Resource';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function ReplicaSetList() {
  const [replicaSets, setReplicaSets] = React.useState(null);
  const filterFunc = useFilterFunc();

  function getReplicas(replicaSet) {
    return `${replicaSet.spec.replicas} / ${replicaSet.status.replicas}`
  }

  useConnectApi(
    api.replicaSet.list.bind(null, null, setReplicaSets),
  );

  return (
    <Paper>
      <SectionFilterHeader
        title="Replica Sets"
      />
      <SectionBox>
        <SimpleTable
          rowsPerPage={[15, 25, 50]}
          filterFunction={filterFunc}
          columns={[
            {
              label: 'Name',
              getter: (replicaSet) => <ResourceLink resource={replicaSet} />
            },
            {
              label: 'Namespace',
              getter: (replicaSet) => replicaSet.metadata.namespace
            },
            {
              label: 'Generation',
              getter: (replicaSet) => replicaSet.status.observedGeneration
            },
            {
              label: 'Replicas',
              getter: (replicaSet) => getReplicas(replicaSet)
            },
            {
              label: 'Age',
              getter: (replicaSet) => timeAgo(replicaSet.metadata.creationTimestamp)
            },
          ]}
          data={replicaSets}
        />
      </SectionBox>
    </Paper>
  );
}