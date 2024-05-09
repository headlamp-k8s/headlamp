import { useTranslation } from 'react-i18next';
import Secret from '../../lib/k8s/secret';
import { useFilterFunc } from '../../lib/util';
import ResourceListView from '../common/Resource/ResourceListView';

export default function SecretList() {
  const filterFunc = useFilterFunc<Secret>(['.jsonData.type']);
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ResourceListView
      title={t('Secrets')}
      resourceClass={Secret}
      filterFunction={filterFunc}
      columns={[
        'name',
        'namespace',
        {
          id: 'type',
          label: t('translation|Type'),
          getValue: secret => secret.type,
        },
        {
          id: 'data',
          label: t('translation|Data'),
          getValue: (secret: Secret) => Object.keys(secret.data || {}).length || 0,
        },
        'age',
      ]}
    />
  );
}
