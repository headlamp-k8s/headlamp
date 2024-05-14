import { useTranslation } from 'react-i18next';
import StorageClass from '../../lib/k8s/storageClass';
import ResourceListView from '../common/Resource/ResourceListView';

export default function ClassList() {
  const { t } = useTranslation('glossary');

  return (
    <ResourceListView
      title={t('Storage Classes')}
      headerProps={{
        noNamespaceFilter: true,
      }}
      resourceClass={StorageClass}
      columns={[
        'name',
        {
          id: 'provisioner',
          label: t('Provisioner'),
          getValue: storageClass => storageClass.provisioner,
        },
        {
          id: 'reclaimPolicy',
          label: t('Reclaim Policy'),
          getValue: storageClass => storageClass.reclaimPolicy,
        },
        {
          id: 'volumeBindingMode',
          label: t('Volume Binding Mode'),
          getValue: storageClass => storageClass.volumeBindingMode,
        },
        {
          id: 'allowVolumeExpansion',
          label: t('Allow Volume Expansion'),
          getValue: storageClass => storageClass.allowVolumeExpansion,
        },
        'age',
      ]}
    />
  );
}
