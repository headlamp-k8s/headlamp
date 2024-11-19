import { useTranslation } from 'react-i18next';
import { GatewayParentReference } from '../../lib/k8s/gateway';
import { Link, SectionBox, SimpleTable } from '../common';

export function GatewayParentRefSection(props: { parentRefs: GatewayParentReference[] }) {
  const { parentRefs } = props;
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <SectionBox title={t('translation|ParentRefs')}>
      <SimpleTable
        emptyMessage={t('translation|No rules data to be shown.')}
        columns={[
          {
            label: t('translation|Name'),
            getter: (data: GatewayParentReference) => (
              <Link
                routeName={data.kind?.toLowerCase()}
                params={{ namespace: data.namespace, name: data.name }}
              >
                {data.name}
              </Link>
            ),
          },
          {
            label: t('translation|Namespace'),
            getter: (data: GatewayParentReference) => data.namespace,
          },
          {
            label: t('translation|Kind'),
            getter: (data: GatewayParentReference) => data.kind,
          },
          {
            label: t('translation|Group'),
            getter: (data: GatewayParentReference) => data.group,
          },
          {
            label: t('translation|Section Name'),
            getter: (data: GatewayParentReference) => data.sectionName,
          },
          {
            label: t('translation|Port'),
            getter: (data: GatewayParentReference) => data.port,
          },
        ]}
        data={parentRefs || []}
        reflectInURL="parentRefs"
      />
    </SectionBox>
  );
}
