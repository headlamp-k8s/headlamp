import React from 'react';
import { useTranslation } from 'react-i18next';
import StatefulSet from '../../lib/k8s/statefulSet';
import { useFilterFunc } from '../../lib/util';
import { Link } from '../common';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function StatefulSetList() {
  const [statefulSets, error] = StatefulSet.useList();
  const filterFunc = useFilterFunc();
  const { t } = useTranslation('glossary');

  function renderPods(statefulSet: StatefulSet) {
    const { readyReplicas, currentReplicas } = statefulSet.status;

    return `${readyReplicas || 0}/${currentReplicas || 0}`;
  }

  return (
    <SectionBox title={<SectionFilterHeader title={t('Stateful Sets')} />}>
      <SimpleTable
        rowsPerPage={[15, 25, 50]}
        filterFunction={filterFunc}
        errorMessage={StatefulSet.getErrorMessage(error)}
        columns={[
          {
            label: t('frequent|Name'),
            getter: statefulSet => <Link kubeObject={statefulSet} />,
            sort: (s1: StatefulSet, s2: StatefulSet) => {
              if (s1.metadata.name < s2.metadata.name) {
                return -1;
              } else if (s1.metadata.name > s2.metadata.name) {
                return 1;
              }
              return 0;
            },
          },
          {
            label: t('glossary|Namespace'),
            getter: statefulSet => statefulSet.getNamespace(),
          },
          {
            label: t('Pods'),
            getter: statefulSet => renderPods(statefulSet),
          },
          {
            label: t('Replicas'),
            getter: statefulSet => statefulSet.spec.replicas,
          },
          {
            label: t('frequent|Age'),
            getter: statefulSet => statefulSet.getAge(),
            sort: (s1: StatefulSet, s2: StatefulSet) =>
              new Date(s2.metadata.creationTimestamp).getTime() -
              new Date(s1.metadata.creationTimestamp).getTime(),
          },
        ]}
        data={statefulSets}
        defaultSortingColumn={5}
      />
    </SectionBox>
  );
}
