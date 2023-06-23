import { useTranslation } from 'react-i18next';
import PriorityClass from '../../lib/k8s/priorityClasses';
import ResourceListView from '../common/Resource/ResourceListView';

export default function PriorityClassList() {
  const { t } = useTranslation(['glossary', 'priorityClasses']);

  return (
    <ResourceListView
      title={t('glossary|PriorityClass')}
      resourceClass={PriorityClass}
      columns={[
        'name',
        {
          id: 'value',
          label: t('frequent|Value'),
          getter: item => item.value,
        },
        {
          id: 'globalDefault',
          label: t('priorityClasses|Global Default'),
          getter: item => item.globalDefault || 'False',
        },
        'age',
      ]}
    />
  );
}
