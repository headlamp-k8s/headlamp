import Box from '@mui/system/Box';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { KubeCondition } from '../../lib/k8s/cluster';
import Gateway, {
  GatewayAddress,
  GatewayListener,
  GatewayListenerStatus,
} from '../../lib/k8s/gateway';
import { EmptyContent, StatusLabel, StatusLabelProps } from '../common';
import Link from '../common/Link';
import { ConditionsTable, DetailsGrid } from '../common/Resource';
import SectionBox from '../common/SectionBox';
import SimpleTable, { NameValueTable } from '../common/SimpleTable';

function GatewayListenerTable(props: {
  listener: GatewayListener;
  status: GatewayListenerStatus | null;
}) {
  const { listener, status } = props;
  const { t } = useTranslation(['glossary', 'translation']);

  function makeStatusLabel(condition: KubeCondition) {
    let status: StatusLabelProps['status'] = '';
    if (condition.type === 'Available') {
      status = condition.status === 'True' ? 'success' : 'error';
    }

    return (
      <Box display="inline-block" sx={theme => ({ paddingRight: theme.spacing(1) })}>
        <StatusLabel status={status}>{condition.type}</StatusLabel>
      </Box>
    );
  }
  const mainRows = [
    {
      name: listener.name,
      withHighlightStyle: true,
    },
    {
      name: t('translation|Hostname'),
      value: listener.hostname,
    },
    {
      name: t('translation|Port'),
      value: listener.port,
    },
    {
      name: t('translation|Protocol'),
      value: listener.protocol,
    },
    {
      name: t('translation|Conditions'),
      value: status?.conditions.map(c => makeStatusLabel(c)),
    },
  ];
  return <NameValueTable rows={mainRows} />;
}

export default function GatewayDetails(props: { name?: string; namespace?: string }) {
  const params = useParams<{ namespace: string; name: string }>();
  const { name = params.name, namespace = params.namespace } = props;
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <DetailsGrid
      resourceType={Gateway}
      name={name}
      namespace={namespace}
      withEvents
      extraInfo={gateway =>
        gateway && [
          {
            name: t('Class Name'),
            value: gateway.spec?.gatewayClassName ? (
              <Link routeName="gatewayclass" params={{ name: gateway.spec?.gatewayClassName }}>
                {gateway.spec?.gatewayClassName}
              </Link>
            ) : null,
          },
        ]
      }
      extraSections={(item: Gateway) =>
        item && [
          {
            id: 'headlamp.gateway-addresses',
            section: item && (
              <SectionBox title={t('Addresses')}>
                <SimpleTable
                  emptyMessage={t('translation|No addresses data to be shown.')}
                  columns={[
                    {
                      label: t('translation|Type'),
                      getter: (data: GatewayAddress) => data.type,
                    },
                    {
                      label: t('translation|Value'),
                      getter: (data: GatewayAddress) => data.value,
                    },
                  ]}
                  data={item?.getAddresses() || []}
                  reflectInURL="addresses"
                />
              </SectionBox>
            ),
          },
          {
            id: 'headlamp.gateway-listeners',
            section: item && (
              <SectionBox title={t('Listeners')}>
                {item.getListeners().length === 0 ? (
                  <EmptyContent>{t('No data')}</EmptyContent>
                ) : (
                  item
                    .getListeners()
                    .map((listener: GatewayListener) => (
                      <GatewayListenerTable
                        listener={listener}
                        status={item.getListernerStatusByName(listener.name)}
                      />
                    ))
                )}
              </SectionBox>
            ),
          },
          {
            id: 'headlamp.gateway-conditions',
            section: (
              <SectionBox title={t('translation|Conditions')}>
                <ConditionsTable resource={item.jsonData} showLastUpdate={false} />
              </SectionBox>
            ),
          },
        ]
      }
    />
  );
}
