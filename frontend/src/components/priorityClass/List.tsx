import { useTranslation } from 'react-i18next';
import PriorityClass from '../../lib/k8s/priorityClass';
import ResourceListView from '../common/Resource/ResourceListView';

export default function PriorityClassList() {
  const { t } = useTranslation(['glossary']);

  return (
    <ResourceListView
      title={t('glossary|PriorityClass')}
      resourceClass={PriorityClass}
      columns={[
        'name',
        {
          id: 'value',
          label: t('translation|Value'),
          getValue: item => item.value,
        },
        {
          id: 'globalDefault',
          label: t('translation|Global Default'),
          getValue: item => String(item.globalDefault || 'False'),
        },
        'cluster',
        'age',
      ]}
    />
  );
}
