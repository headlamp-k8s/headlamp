import { useTranslation } from 'react-i18next';
import { LimitRange } from '../../lib/k8s/limitRange';
import { SectionBox, SectionFilterHeader } from '../common';
import ResourceTable from '../common/Resource/ResourceTable';

export function LimitRangeList() {
  const { t } = useTranslation('glossary');
  return (
    <SectionBox title={<SectionFilterHeader title={t('glossary|LimitRange')} />}>
      <ResourceTable resourceClass={LimitRange} columns={['name', 'namespace', 'age']} />
    </SectionBox>
  );
}
