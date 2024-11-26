import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import HTTPRoute, { HTTPRouteRule } from '../../lib/k8s/httpRoute';
import { EmptyContent, LabelListItem, NameValueTable } from '../common';
import { DetailsGrid } from '../common/Resource';
import SectionBox from '../common/SectionBox';
import { GatewayParentRefSection } from './utils';

function HTTPRouteRuleTable(props: { rule: HTTPRouteRule }) {
  const { rule } = props;
  const { t } = useTranslation(['glossary', 'translation']);

  const mainRows = [
    {
      name: rule.name,
      withHighlightStyle: true,
      hide: rule.name === undefined,
    },
    {
      name: t('translation|BackendRefs'),
      value: rule.backendRefs?.length,
      hide: (rule.backendRefs?.length || 0) === 0,
    },
    {
      name: t('translation|Matches'),
      value: rule.matches?.length,
      hide: (rule.matches?.length || 0) === 0,
    },
  ];
  return <NameValueTable rows={mainRows} />;
}

export default function HTTPRouteDetails(props: { name?: string; namespace?: string }) {
  const params = useParams<{ namespace: string; name: string }>();
  const { name = params.name, namespace = params.namespace } = props;
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <DetailsGrid
      resourceType={HTTPRoute}
      name={name}
      namespace={namespace}
      extraInfo={httpRoute =>
        httpRoute && [
          {
            name: 'Hostnames',
            value: <LabelListItem labels={httpRoute.hostnames.map(tls => `${tls}`)} />,
          },
        ]
      }
      withEvents
      extraSections={(item: HTTPRoute) =>
        item && [
          {
            id: 'headlamp.httproute-rules',
            section: item && (
              <SectionBox title={t('Rules')}>
                {item.rules.length === 0 ? (
                  <EmptyContent>{t('No data')}</EmptyContent>
                ) : (
                  item.rules.map((rule: HTTPRouteRule, index: any) => (
                    <HTTPRouteRuleTable rule={rule} key={index} />
                  ))
                )}
              </SectionBox>
            ),
          },
          {
            id: 'headlamp.httproute-parentrefs',
            section: <GatewayParentRefSection parentRefs={item?.parentRefs || []} />,
          },
        ]
      }
    />
  );
}
