import { useTranslation } from 'react-i18next';
import Secret from '../../lib/k8s/secret';
import { useFilterFunc } from '../../lib/util';
import ResourceListView from '../common/Resource/ResourceListView';

export default function SecretList() {
  const filterFunc = useFilterFunc(['.jsonData.type']);
  const { t } = useTranslation('glossary');

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
        'age',
      ]}
    />
  );
}
