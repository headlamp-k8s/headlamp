import { useTranslation } from 'react-i18next';
import ConfigMap from '../../lib/k8s/configMap';
import ResourceListView from '../common/Resource/ResourceListView';

export default function ConfigMapList() {
  const { t } = useTranslation('glossary');

  return (
    <ResourceListView
      title={t('Config Maps')}
      resourceClass={ConfigMap}
      columns={['name', 'namespace', 'age']}
    />
  );
}
