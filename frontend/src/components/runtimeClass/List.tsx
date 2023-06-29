import { useTranslation } from 'react-i18next';
import { RuntimeClass } from '../../lib/k8s/runtime';
import ResourceListView from '../common/Resource/ResourceListView';

export function RuntimeClassList() {
  const { t } = useTranslation(['glossary', 'frequent']);

  return (
    <ResourceListView
      title={t('glossary|RuntimeClass')}
      resourceClass={RuntimeClass}
      columns={[
        'name',
        {
          id: 'handler',
          label: t('frequent|Handler'),
          getter: item => item?.jsonData?.handler,
        },
        'age',
      ]}
    />
  );
}
