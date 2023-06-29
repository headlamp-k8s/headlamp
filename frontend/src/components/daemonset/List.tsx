import { useTranslation } from 'react-i18next';
import DaemonSet from '../../lib/k8s/daemonSet';
import ResourceListView from '../common/Resource/ResourceListView';

export default function DaemonSetList() {
  const { t } = useTranslation('glossary');

  return (
    <ResourceListView
      title={t('Daemon Sets')}
      resourceClass={DaemonSet}
      columns={[
        'name',
        'namespace',
        {
          id: 'pods',
          label: t('Pods'),
          getter: daemonSet => daemonSet.status.currentNumberScheduled,
          sort: true,
        },
        'age',
      ]}
    />
  );
}
