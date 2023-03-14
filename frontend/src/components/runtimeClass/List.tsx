import { useTranslation } from 'react-i18next';
import { RuntimeClass } from '../../lib/k8s/runtime';
import { SectionBox, SectionFilterHeader } from '../common';
import ResourceTable from '../common/Resource/ResourceTable';

export function RuntimeClassList() {
  const { t } = useTranslation(['glossary', 'frequent']);

  return (
    <SectionBox title={<SectionFilterHeader title={t('glossary|RuntimeClass')} />}>
      <ResourceTable
        resourceClass={RuntimeClass}
        columns={[
          'name',
          {
            label: t('frequent|Handler'),
            getter: item => item?.jsonData?.handler,
          },
          'age',
        ]}
      />
    </SectionBox>
  );
}
