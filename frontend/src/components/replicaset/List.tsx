import React from 'react';
import ReplicaSet from '../../lib/k8s/replicaSet';
import { useFilterFunc } from '../../lib/util';
import { Link } from '../common';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function ReplicaSetList() {
  const [replicaSets, setReplicaSets] = React.useState<ReplicaSet | null>(null);
  const filterFunc = useFilterFunc();

  function getReplicas(replicaSet: ReplicaSet) {
    return `${replicaSet.spec.replicas} / ${replicaSet.status.replicas}`;
  }

  ReplicaSet.useApiList(setReplicaSets);

  return (
    <SectionBox
      title={
        <SectionFilterHeader
          title="Replica Sets"
        />
      }
    >
      <SimpleTable
        rowsPerPage={[15, 25, 50]}
        filterFunction={filterFunc}
        columns={[
          {
            label: 'Name',
            getter: (replicaSet) => <Link kubeObject={replicaSet} />
          },
          {
            label: 'Namespace',
            getter: (replicaSet) => replicaSet.getNamespace()
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
            getter: (replicaSet) => replicaSet.getAge()
          },
        ]}
        data={replicaSets}
      />
    </SectionBox>
  );
}
