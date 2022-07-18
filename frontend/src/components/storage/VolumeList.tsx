import { useTranslation } from 'react-i18next';
import PersistentVolume from '../../lib/k8s/persistentVolume';
import ResourceTable from '../common/Resource/ResourceTable';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';

export default function VolumeList() {
  const { t } = useTranslation('glossary');

  return (
    <SectionBox title={<SectionFilterHeader title={t('Persistent Volumes')} noNamespaceFilter />}>
      <ResourceTable
        resourceClass={PersistentVolume}
        columns={[
          'name',
          {
            label: t('Status'),
            getter: volume => volume.status.phase,
            sort: true,
          },
          {
            label: t('Capacity'),
            getter: volume => volume.spec.capacity.storage,
          },
          'age',
        ]}
      />
    </SectionBox>
  );
}
