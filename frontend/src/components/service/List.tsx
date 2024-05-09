import { useTranslation } from 'react-i18next';
import Service from '../../lib/k8s/service';
import LabelListItem from '../common/LabelListItem';
import ResourceListView from '../common/Resource/ResourceListView';

export default function ServiceList() {
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ResourceListView
      title={t('Services')}
      resourceClass={Service}
      columns={[
        'name',
        'namespace',
        {
          id: 'type',
          label: t('translation|Type'),
          getValue: service => service.spec.type,
        },
        {
          id: 'clusterIP',
          label: t('Cluster IP'),
          getValue: service => service.spec.clusterIP,
        },
        {
          id: 'externalIP',
          label: t('External IP'),
          getValue: service => service.getExternalAddresses(),
        },
        {
          id: 'ports',
          label: t('Ports'),
          getValue: service => service.getPorts().join(', '),
          render: service => <LabelListItem labels={service.getPorts()} />,
        },
        {
          id: 'selector',
          label: t('Selector'),
          getValue: service => service.getSelector().join(', '),
          render: service => <LabelListItem labels={service.getSelector()} />,
        },
        'age',
      ]}
    />
  );
}
