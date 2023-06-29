import { useTranslation } from 'react-i18next';
import PersistentVolumeClaim from '../../lib/k8s/persistentVolumeClaim';
import ResourceListView from '../common/Resource/ResourceListView';

export default function VolumeClaimList() {
  const { t } = useTranslation('glossary');

  return (
    <ResourceListView
      title={t('Volume Claims')}
      resourceClass={PersistentVolumeClaim}
      columns={[
        'name',
        'namespace',
        {
          id: 'status',
          label: t('Status'),
          getter: volumeClaim => volumeClaim.status.phase,
          sort: true,
        },
        {
          id: 'className',
          label: t('Class Name'),
          getter: volumeClaim => volumeClaim.spec.storageClassName,
          sort: true,
        },
        {
          id: 'volume',
          label: t('Volume'),
          getter: volumeClaim => volumeClaim.spec.volumeName,
          sort: true,
        },
        {
          id: 'capacity',
          label: t('Capacity'),
          getter: volumeClaim => volumeClaim.status.capacity?.storage,
        },
        'age',
      ]}
    />
  );
}
