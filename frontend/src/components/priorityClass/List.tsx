import { useTranslation } from 'react-i18next';
import PriorityClass from '../../lib/k8s/priorityClasses';
import { SectionBox, SectionFilterHeader } from '../common';
import ResourceTable from '../common/Resource/ResourceTable';

export default function PriorityClassList() {
  const { t } = useTranslation(['glossary', 'priorityClasses']);

  return (
    <SectionBox title={<SectionFilterHeader title={t('glossary|PriorityClass')} />}>
      <ResourceTable
        resourceClass={PriorityClass}
        columns={[
          'name',
          {
            label: t('frequent|Value'),
            getter: item => item.value,
          },
          {
            label: t('priorityClasses|Global Default'),
            getter: item => item.globalDefault || 'False',
          },
          'age',
        ]}
      />
    </SectionBox>
  );
}
