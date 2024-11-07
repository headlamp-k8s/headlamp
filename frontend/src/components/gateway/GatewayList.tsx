import { useTranslation } from 'react-i18next';
import Gateway from '../../lib/k8s/gateway';
import Link from '../common/Link';
import ResourceListView from '../common/Resource/ResourceListView';
import { makeGatewayStatusLabel } from './ClassList';

export default function GatewayList() {
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ResourceListView
      title={t('Gateways')}
      resourceClass={Gateway}
      columns={[
        'name',
        'namespace',
        'cluster',
        {
          id: 'class',
          label: t('Class Name'),
          getValue: gateway => gateway.spec?.gatewayClassName,
          render: gateway =>
            gateway.spec?.gatewayClassName ? (
              <Link routeName="gatewayclass" params={{ name: gateway.spec?.gatewayClassName }}>
                {gateway.spec?.gatewayClassName}
              </Link>
            ) : null,
        },
        {
          id: 'conditions',
          label: t('translation|Conditions'),
          getValue: (gateway: Gateway) =>
            gateway.status?.conditions?.find(
              ({ status }: { status: string }) => status === 'True'
            ) ?? null,
          render: (gateway: Gateway) => makeGatewayStatusLabel(gateway.status?.conditions),
        },
        {
          id: 'listeners',
          label: t('translation|Listeners'),
          getValue: (gateway: Gateway) => gateway.spec.listeners.length,
        },
        'age',
      ]}
    />
  );
}
