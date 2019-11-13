import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import api, { useConnectApi } from '../../lib/api';
import { timeAgo } from '../../lib/util';
import SectionHeader from '../common/SectionHeader';
import SimpleTable from '../common/SimpleTable';

export default function ReplicaSetList() {
  const [replicasetsData, setReplicaSetsData] = React.useState([]);

  function setReplicaSets(replicaSets) {
    const data = replicaSets.map(replicaSet => {
      return {
        name: replicaSet.metadata.name,
        namespace: replicaSet.metadata.namespace,
        generation: replicaSet.status.observedGeneration,
        replicas: getReplicas(replicaSet),
        date: timeAgo(replicaSet.metadata.creationTimestamp),
      };
    });
    setReplicaSetsData(data);
  }

  function getReplicas(replicaSet) {
    return `${replicaSet.spec.replicas} / ${replicaSet.status.replicas}`
  }

  useConnectApi(
    api.replicaSet.list.bind(null, null, setReplicaSets),
  );

  return (
    <Paper>
      <SectionHeader title="Replica Sets" />
      <Box margin={1}>
        <SimpleTable
          rowsPerPage={[15, 25, 50]}
          columns={[
            {
              label: 'Name',
              datum: 'name'
            },
            {
              label: 'Namespace',
              datum: 'namespace',
            },
            {
              label: 'Generation',
              datum: 'generation',
            },
            {
              label: 'Replicas',
              datum: 'replicas',
            },
            {
              label: 'Age',
              datum: 'date',
            },
          ]}
          data={replicasetsData}
        />
      </Box>
    </Paper>
  );
}