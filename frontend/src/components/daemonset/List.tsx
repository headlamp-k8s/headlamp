import React from 'react';
import { useTranslation } from 'react-i18next';
import DaemonSet from '../../lib/k8s/daemonSet';
import { useFilterFunc } from '../../lib/util';
import { Link } from '../common';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
import SimpleTable from '../common/SimpleTable';

export default function DaemonSetList() {
  const [daemonSets, error] = DaemonSet.useList();
  const filterFunc = useFilterFunc();
  const { t } = useTranslation('glossary');

  return (
    <SectionBox title={<SectionFilterHeader title={t('Daemon Sets')} />}>
      <SimpleTable
        rowsPerPage={[15, 25, 50]}
        filterFunction={filterFunc}
        errorMessage={DaemonSet.getErrorMessage(error)}
        columns={[
          {
            label: t('frequent|Name'),
            getter: daemonSet => <Link kubeObject={daemonSet} />,
            sort: (d1: DaemonSet, d2: DaemonSet) => {
              if (d1.metadata.name < d2.metadata.name) {
                return -1;
              } else if (d1.metadata.name > d2.metadata.name) {
                return 1;
              }
              return 0;
            },
          },
          {
            label: t('glossary|Namespace'),
            getter: daemonSet => daemonSet.getNamespace(),
          },
          {
            label: t('Pods'),
            getter: daemonSet => daemonSet.status.currentNumberScheduled,
          },
          {
            label: t('frequent|Age'),
            getter: daemonSet => daemonSet.getAge(),
            sort: (d1: DaemonSet, d2: DaemonSet) =>
              new Date(d2.metadata.creationTimestamp).getTime() -
              new Date(d1.metadata.creationTimestamp).getTime(),
          },
        ]}
        data={daemonSets}
        defaultSortingColumn={4}
      />
    </SectionBox>
  );
}
