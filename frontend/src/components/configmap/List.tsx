import { useTranslation } from 'react-i18next';
import ConfigMap from '../../lib/k8s/configMap';
import ResourceListView from '../common/Resource/ResourceListView';

export default function ConfigMapList() {
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ResourceListView
      title={t('glossary|Config Maps')}
      resourceClass={ConfigMap}
      columns={[
        'name',
        'namespace',
        'cluster',
        {
          id: 'data',
          label: t('translation|Data'),
          getValue: (configmap: ConfigMap) => Object.keys(configmap.data || {}).length || 0,
          gridTemplate: 'min-content',
        },
        'age',
      ]}
    />
  );
}
