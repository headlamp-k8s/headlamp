import { useTranslation } from 'react-i18next';
import PersistentVolume from '../../lib/k8s/persistentVolume';
import ResourceListView from '../common/Resource/ResourceListView';

export default function VolumeList() {
  const { t } = useTranslation('glossary');

  return (
    <ResourceListView
      title={t('Persistent Volumes')}
      headerProps={{
        noNamespaceFilter: true,
      }}
      resourceClass={PersistentVolume}
      columns={[
        'name',
        {
          id: 'status',
          label: t('Status'),
          getter: volume => volume.status.phase,
          sort: true,
        },
        {
          id: 'capacity',
          label: t('Capacity'),
          getter: volume => volume.spec.capacity.storage,
        },
        'age',
      ]}
    />
  );
}
