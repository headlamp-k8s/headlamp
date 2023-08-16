import { useTranslation } from 'react-i18next';
import { Lease } from '../../lib/k8s/lease';
import ResourceListView from '../common/Resource/ResourceListView';

export function LeaseList() {
  const { t } = useTranslation(['glossary', 'translation']);
  return (
    <ResourceListView
      title={t('glossary|Lease')}
      resourceClass={Lease}
      columns={[
        'name',
        'namespace',
        {
          id: 'holder',
          label: t('translation|Holder'),
          getter: item => item?.spec.holderIdentity,
        },
        'age',
      ]}
    />
  );
}
