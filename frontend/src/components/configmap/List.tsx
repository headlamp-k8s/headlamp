import { useTranslation } from 'react-i18next';
import ConfigMap from '../../lib/k8s/configMap';
import ResourceTable from '../common/Resource/ResourceTable';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';

export default function ConfigMapList() {
  const { t } = useTranslation('glossary');

  return (
    <SectionBox title={<SectionFilterHeader title={t('Config Maps')} />}>
      <ResourceTable resourceClass={ConfigMap} columns={['name', 'namespace', 'age']} />
    </SectionBox>
  );
}
