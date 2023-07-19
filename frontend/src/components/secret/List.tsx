import { useTranslation } from 'react-i18next';
import Secret from '../../lib/k8s/secret';
import { useFilterFunc } from '../../lib/util';
import ResourceListView from '../common/Resource/ResourceListView';

export default function SecretList() {
  const filterFunc = useFilterFunc(['.jsonData.type']);
  const { t } = useTranslation(['glossary', 'frequent']);

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
          label: t('Type'),
          getter: secret => secret.type,
          sort: true,
        },
        {
          id: 'data',
          label: t('frequent|Data'),
          getter: (secret: Secret) => Object.keys(secret.data || {}).length || 0,
          sort: true,
        },
        'age',
      ]}
    />
  );
}
