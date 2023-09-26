import { useTranslation } from 'react-i18next';
import Secret from '../../lib/k8s/secret';
import { useFilterFunc } from '../../lib/util';
import ResourceListView from '../common/Resource/ResourceListView';

export default function SecretList() {
  const filterFunc = useFilterFunc(['.jsonData.type']);
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
          getter: secret => secret.type,
          sort: true,
        },
        {
          id: 'data',
          label: t('translation|Data'),
          getter: (secret: Secret) => Object.keys(secret.data || {}).length || 0,
          sort: true,
        },
        'age',
      ]}
    />
  );
}
