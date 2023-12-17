import React from 'react';
import { useTranslation } from 'react-i18next';
import Ingress from '../../lib/k8s/ingress';
import LabelListItem from '../common/LabelListItem';
import Link from '../common/Link';
import ResourceListView from '../common/Resource/ResourceListView';

function RulesDisplay(props: { ingress: Ingress }) {
  const { ingress } = props;

  const rulesText = React.useMemo(() => {
    const rules = ingress.getRules();
    let labels: string[] = [];

    rules.forEach(({ http }) => {
      const text = http.paths.map(({ path, backend }) => {
        let target = '';
        if (!!backend.service) {
          const service = backend.service.name;
          const port = backend.service.port.number ?? backend.service.port.name ?? '';
          target = `${!!service ? service + ':' + port.toString() : port.toString()}`;
        } else if (!!backend.resource) {
          target = `${backend.resource.kind}:${backend.resource.name}`;
        }
        return `${path} 🞂 ${target}`;
      });
      labels = labels.concat(text);
    });

    return labels;
  }, [ingress]);

  return <LabelListItem labels={rulesText} />;
}

export default function IngressList() {
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ResourceListView
      title={t('Ingresses')}
      resourceClass={Ingress}
      columns={[
        'name',
        'namespace',
        {
          id: 'class',
          label: t('Class Name'),
          getter: (ingress: Ingress) =>
            ingress.spec?.ingressClassName ? (
              <Link routeName="ingressclass" params={{ name: ingress.spec?.ingressClassName }}>
                {ingress.spec?.ingressClassName}
              </Link>
            ) : null,
          sort: true,
        },
        {
          id: 'hosts',
          label: t('Hosts'),
          getter: (ingress: Ingress) => (
            <LabelListItem labels={ingress.getRules().map(({ host }) => host || '*')} />
          ),
        },
        {
          id: 'ports',
          label: t('translation|Path'),
          getter: (ingress: Ingress) => <RulesDisplay ingress={ingress} />,
        },
        'age',
      ]}
    />
  );
}
