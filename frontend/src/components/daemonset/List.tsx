import { useTranslation } from 'react-i18next';
import DaemonSet from '../../lib/k8s/daemonSet';
import ResourceTable from '../common/Resource/ResourceTable';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';

export default function DaemonSetList() {
  const { t } = useTranslation('glossary');

  return (
    <SectionBox title={<SectionFilterHeader title={t('Daemon Sets')} />}>
      <ResourceTable
        resourceClass={DaemonSet}
        columns={[
          'name',
          'namespace',
          {
            label: t('Pods'),
            getter: daemonSet => daemonSet.status.currentNumberScheduled,
            sort: true,
          },
          'age',
        ]}
      />
    </SectionBox>
  );
}
