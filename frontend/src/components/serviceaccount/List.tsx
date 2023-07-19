import { useTranslation } from 'react-i18next';
import ServiceAccount from '../../lib/k8s/serviceAccount';
import ResourceListView from '../common/Resource/ResourceListView';

export default function ServiceAccountList() {
  const { t } = useTranslation('glossary');

  return (
    <ResourceListView
      title={t('Service Accounts')}
      resourceClass={ServiceAccount}
      columns={[
        'name',
        'namespace',
        {
          id: 'secrets',
          label: t('Secrets'),
          getter: (serviceaccount: ServiceAccount) => serviceaccount?.secrets?.length || 0,
          sort: true,
          gridTemplate: 0.5,
        },
        'age',
      ]}
    />
  );
}
