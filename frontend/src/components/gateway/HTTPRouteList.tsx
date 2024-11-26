import { useTranslation } from 'react-i18next';
import HTTPRoute from '../../lib/k8s/httpRoute';
import { LabelListItem } from '../common';
import ResourceListView from '../common/Resource/ResourceListView';

export default function HTTPRouteList() {
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ResourceListView
      title={t('HttpRoutes')}
      resourceClass={HTTPRoute}
      columns={[
        'name',
        'namespace',
        'cluster',
        {
          id: 'hostnames',
          label: t('Hostnames'),
          getValue: httpRoute => httpRoute.hostnames.join(''),
          render: httpRoute => (
            <LabelListItem labels={httpRoute.hostnames.map(host => host || '*')} />
          ),
        },
        {
          id: 'rules',
          label: t('translation|rules'),
          getValue: (httpRoute: HTTPRoute) => httpRoute.spec.rules?.length,
        },
        'age',
      ]}
    />
  );
}
