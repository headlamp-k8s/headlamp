import { useTranslation } from 'react-i18next';
import { RuntimeClass } from '../../lib/k8s/runtime';
import ResourceListView from '../common/Resource/ResourceListView';

export function RuntimeClassList() {
  const { t } = useTranslation(['glossary', 'translation']);

  return (
    <ResourceListView
      title={t('glossary|RuntimeClass')}
      resourceClass={RuntimeClass}
      columns={[
        'name',
        {
          id: 'handler',
          label: t('translation|Handler'),
          getter: item => item?.jsonData?.handler,
        },
        'age',
      ]}
    />
  );
}
