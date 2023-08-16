import { useTranslation } from 'react-i18next';
import ConfigMap from '../../lib/k8s/configMap';
import ResourceListView from '../common/Resource/ResourceListView';

export default function ConfigMapList() {
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ResourceListView
      title={t('Config Maps')}
      resourceClass={ConfigMap}
      columns={[
        'name',
        'namespace',
        {
          id: 'data',
          label: t('translation|Data'),
          getter: (configmap: ConfigMap) => Object.keys(configmap.data || {}).length || 0,
          sort: true,
          gridTemplate: 0.5,
        },
        'age',
      ]}
    />
  );
}
