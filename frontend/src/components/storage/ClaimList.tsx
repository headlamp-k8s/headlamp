import React from 'react';
import { useTranslation } from 'react-i18next';
import PersistentVolumeClaim from '../../lib/k8s/persistentVolumeClaim';
import { useFilterFunc } from '../../lib/util';
import Link from '../common/Link';
import { SectionBox } from '../common/SectionBox';
import SimpleTable from '../common/SimpleTable';

export default function VolumeClaimList() {
  const [volumeClaim, error] = PersistentVolumeClaim.useList();
  const filterFunc = useFilterFunc();
  const { t } = useTranslation('glossary');

  return (
    <SectionBox
      title={t('Volume Claims')}
      headerProps={{
        headerStyle: 'main',
      }}
    >
      <SimpleTable
        rowsPerPage={[15, 25, 50]}
        filterFunction={filterFunc}
        errorMessage={PersistentVolumeClaim.getErrorMessage(error)}
        columns={[
          {
            label: t('frequent|Name'),
            getter: volumeClaim => <Link kubeObject={volumeClaim} />,
            sort: (v1: PersistentVolumeClaim, v2: PersistentVolumeClaim) => {
              if (v1.metadata.name < v2.metadata.name) {
                return -1;
              } else if (v1.metadata.name > v2.metadata.name) {
                return 1;
              }
              return 0;
            },
          },
          {
            label: t('glossary|Namespace'),
            getter: volumeClaim => volumeClaim.getNamespace(),
          },
          {
            label: t('Status'),
            getter: volumeClaim => volumeClaim.status.phase,
          },
          {
            label: t('Class Name'),
            getter: volumeClaim => volumeClaim.spec.storageClassName,
          },
          {
            label: t('Volume'),
            getter: volumeClaim => volumeClaim.spec.volumeName,
          },
          {
            label: t('Capacity'),
            getter: volumeClaim => volumeClaim.status.capacity?.storage,
          },
          {
            label: t('frequent|Age'),
            getter: volumeClaim => volumeClaim.getAge(),
            sort: (v1: PersistentVolumeClaim, v2: PersistentVolumeClaim) =>
              new Date(v2.metadata.creationTimestamp).getTime() -
              new Date(v1.metadata.creationTimestamp).getTime(),
          },
        ]}
        data={volumeClaim}
        defaultSortingColumn={7}
      />
    </SectionBox>
  );
}
