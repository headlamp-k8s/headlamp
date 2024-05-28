import { useTranslation } from 'react-i18next';
import { Lease } from '../../lib/k8s/lease';
import { CreateResourceButton } from '../common/CreateResourceButton';
import ResourceListView from '../common/Resource/ResourceListView';

export function LeaseList() {
  const { t } = useTranslation(['glossary', 'translation']);
  return (
    <ResourceListView
      title={t('glossary|Lease')}
      headerProps={{
        titleSideActions: [<CreateResourceButton resource="Lease" />],
      }}
      resourceClass={Lease}
      columns={[
        'name',
        'namespace',
        {
          id: 'holder',
          label: t('translation|Holder'),
          getValue: item => item?.spec.holderIdentity,
        },
        'age',
      ]}
    />
  );
}
