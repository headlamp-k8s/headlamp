import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import { SectionBox } from '../common/SectionBox';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';
import { ResourceLink } from '../common/Resource';

export default function ReplicaSetList() {
  const [replicaSets, setReplicaSets] = React.useState(null);

  function getReplicas(replicaSet) {
    return `${replicaSet.spec.replicas} / ${replicaSet.status.replicas}`
  }

  useConnectApi(
    api.replicaSet.list.bind(null, null, setReplicaSets),
  );

  return (
    <Paper>
      <SectionHeader title="Replica Sets" />
      <SectionBox>
        <SimpleTable
          rowsPerPage={[15, 25, 50]}
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