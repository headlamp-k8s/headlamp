import { useTranslation } from 'react-i18next';
import Service from '../../lib/k8s/service';
import ResourceListView from '../common/Resource/ResourceListView';

export default function ServiceList() {
  const { t } = useTranslation('glossary');

  return (
    <ResourceListView
      title={t('Services')}
      resourceClass={Service}
      columns={[
        'name',
        'namespace',
        {
          id: 'type',
          label: t('Type'),
          getter: service => service.spec.type,
          sort: true,
        },
        {
          id: 'clusterIP',
          label: t('Cluster IP'),
          getter: service => service.spec.clusterIP,
          sort: true,
        },
        {
          id: 'externalIP',
          label: t('External IP'),
          getter: service => service.getExternalAddresses(),
          sort: true,
        },
        'age',
      ]}
    />
  );
}
