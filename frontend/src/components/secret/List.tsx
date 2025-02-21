import { useTranslation } from 'react-i18next';
import Secret from '../../lib/k8s/secret';
import ResourceListView from '../common/Resource/ResourceListView';

export default function SecretList() {
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ResourceListView
      title={t('Secrets')}
      resourceClass={Secret}
      columns={[
        'name',
        'namespace',
        'cluster',
        {
          id: 'type',
          label: t('translation|Type'),
          gridTemplate: 'min-content',
          getValue: secret => secret.type,
        },
        {
          id: 'data',
          label: t('translation|Data'),
          gridTemplate: 'min-content',
          getValue: (secret: Secret) => Object.keys(secret.data || {}).length || 0,
        },
        'age',
      ]}
    />
  );
}
