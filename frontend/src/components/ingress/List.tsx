import { useTranslation } from 'react-i18next';
import Ingress from '../../lib/k8s/ingress';
import ResourceListView from '../common/Resource/ResourceListView';

export default function IngressList() {
  const { t } = useTranslation('glossary');

  return (
    <ResourceListView
      title={t('Ingresses')}
      resourceClass={Ingress}
      columns={[
        'name',
        'namespace',
        {
          id: 'hosts',
          label: t('Hosts'),
          getter: ingress => ingress.getHosts(),
        },
        'age',
      ]}
    />
  );
}
