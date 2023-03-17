import { useTranslation } from 'react-i18next';
import { Lease } from '../../lib/k8s/lease';
import { SectionBox, SectionFilterHeader } from '../common';
import ResourceTable from '../common/Resource/ResourceTable';

export function LeaseList() {
  const { t } = useTranslation(['glossary', 'resource', 'frequent']);
  return (
    <SectionBox title={<SectionFilterHeader title={t('glossary|Lease')} />}>
      <ResourceTable
        resourceClass={Lease}
        columns={[
          'name',
          'namespace',
          {
            label: t('frequent|Holder'),
            getter: item => item?.spec.holderIdentity,
          },
          'age',
        ]}
      />
    </SectionBox>
  );
}
