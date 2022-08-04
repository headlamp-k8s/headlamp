import { useTranslation } from 'react-i18next';
import PersistentVolumeClaim from '../../lib/k8s/persistentVolumeClaim';
import ResourceTable from '../common/Resource/ResourceTable';
import { SectionBox } from '../common/SectionBox';

export default function VolumeClaimList() {
  const { t } = useTranslation('glossary');

  return (
    <SectionBox
      title={t('Volume Claims')}
      headerProps={{
        headerStyle: 'main',
      }}
    >
      <ResourceTable
        resourceClass={PersistentVolumeClaim}
        columns={[
          'name',
          'namespace',
          {
            label: t('Status'),
            getter: volumeClaim => volumeClaim.status.phase,
            sort: true,
          },
          {
            label: t('Class Name'),
            getter: volumeClaim => volumeClaim.spec.storageClassName,
            sort: true,
          },
          {
            label: t('Volume'),
            getter: volumeClaim => volumeClaim.spec.volumeName,
            sort: true,
          },
          {
            label: t('Capacity'),
            getter: volumeClaim => volumeClaim.status.capacity?.storage,
          },
          'age',
        ]}
      />
    </SectionBox>
  );
}
