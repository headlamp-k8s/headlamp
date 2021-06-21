import React from 'react';
import { useTranslation } from 'react-i18next';
import ReplicaSet from '../../lib/k8s/replicaSet';
import { useFilterFunc } from '../../lib/util';
import { Link } from '../common';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function ReplicaSetList() {
  const [replicaSets, error] = ReplicaSet.useList();
  const filterFunc = useFilterFunc();
  const { t } = useTranslation('glossary');

  function getReplicas(replicaSet: ReplicaSet) {
    return `${replicaSet.spec.replicas} / ${replicaSet.status.replicas}`;
  }

  return (
    <SectionBox title={<SectionFilterHeader title={t('Replica Sets')} />}>
      <SimpleTable
        rowsPerPage={[15, 25, 50]}
        filterFunction={filterFunc}
        errorMessage={ReplicaSet.getErrorMessage(error)}
        columns={[
          {
            label: t('frequent|Name'),
            getter: replicaSet => <Link kubeObject={replicaSet} />,
            sort: (r1: ReplicaSet, r2: ReplicaSet) => {
              if (r1.metadata.name < r2.metadata.name) {
                return -1;
              } else if (r1.metadata.name > r2.metadata.name) {
                return 1;
              }
              return 0;
            },
          },
          {
            label: t('glossary|Namespace'),
            getter: replicaSet => replicaSet.getNamespace(),
          },
          {
            label: t('Generation'),
            getter: replicaSet => replicaSet.status.observedGeneration,
          },
          {
            label: t('Replicas'),
            getter: replicaSet => getReplicas(replicaSet),
          },
          {
            label: t('frequent|Age'),
            getter: replicaSet => replicaSet.getAge(),
            sort: (r1: ReplicaSet, r2: ReplicaSet) =>
              new Date(r2.metadata.creationTimestamp).getTime() -
              new Date(r1.metadata.creationTimestamp).getTime(),
          },
        ]}
        data={replicaSets}
        defaultSortingColumn={5}
      />
    </SectionBox>
  );
}
