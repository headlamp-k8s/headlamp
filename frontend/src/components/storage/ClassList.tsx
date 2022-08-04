import { useTranslation } from 'react-i18next';
import StorageClass from '../../lib/k8s/storageClass';
import ResourceTable from '../common/Resource/ResourceTable';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';

export default function ClassList() {
  const { t } = useTranslation('glossary');

  return (
    <SectionBox title={<SectionFilterHeader title={t('Storage Classes')} noNamespaceFilter />}>
      <ResourceTable
        resourceClass={StorageClass}
        columns={[
          'name',
          {
            label: t('Reclaim Policy'),
            getter: storageClass => storageClass.reclaimPolicy,
            sort: true,
          },
          {
            label: t('Volume Binding Mode'),
            getter: storageClass => storageClass.volumeBindingMode,
            sort: true,
          },
          'age',
        ]}
      />
    </SectionBox>
  );
}
