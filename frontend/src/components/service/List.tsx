import { useTranslation } from 'react-i18next';
import Service from '../../lib/k8s/service';
import { useTypedSelector } from '../../redux/reducers/reducers';
import LabelListItem from '../common/LabelListItem';
import Link from '../common/Link';
import ResourceListView from '../common/Resource/ResourceListView';

export default function ServiceList() {
  const { t } = useTranslation(['glossary', 'translation']);
  const drawerEnabled = useTypedSelector(state => state.drawerMode.isDetailDrawerEnabled);

  return (
    <ResourceListView
      title={t('Services')}
      resourceClass={Service}
      columns={[
        // 'name',
        {
          id: 'name',
          label: t('translation|Name'),
          getter: (service: Service) => {
            if (drawerEnabled) {
              return (
                <>
                  <Link kubeObject={service} drawerEnabled={drawerEnabled} />
                </>
              );
            }
            return <Link kubeObject={service} />;
          },
          sort: true,
        },
        'namespace',
        {
          id: 'type',
          label: t('translation|Type'),
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
        {
          id: 'ports',
          label: t('Ports'),
          getter: service => <LabelListItem labels={service.getPorts()} />,
          sort: true,
        },
        {
          id: 'selector',
          label: t('Selector'),
          getter: service => <LabelListItem labels={service.getSelector()} />,
          sort: true,
        },
        'age',
      ]}
    />
  );
}
