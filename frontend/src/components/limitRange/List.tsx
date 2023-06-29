import { useTranslation } from 'react-i18next';
import { LimitRange } from '../../lib/k8s/limitRange';
import ResourceListView from '../common/Resource/ResourceListView';

export function LimitRangeList() {
  const { t } = useTranslation('glossary');
  return (
    <ResourceListView
      title={t('glossary|LimitRange')}
      resourceClass={LimitRange}
      columns={['name', 'namespace', 'age']}
    />
  );
}
