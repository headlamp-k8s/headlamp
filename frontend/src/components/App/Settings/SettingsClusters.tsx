import { useTranslation } from 'react-i18next';
import { useClustersConf } from '../../../lib/k8s';
import { Link, SectionBox, SimpleTable } from '../../common';

export default function SettingsClusters() {
  const clusterConf = useClustersConf();
  const { t } = useTranslation(['translation']);

  return (
    <SectionBox title="Cluster Settings">
      <SimpleTable
        columns={[
          {
            label: t('translation|Name'),
            getter: cluster => (
              <Link routeName="settingsCluster" params={{ cluster: cluster.name }}>
                {cluster.name}
              </Link>
            ),
          },
          {
            label: t('translation|Server'),
            datum: 'server',
          },
        ]}
        data={Object.values(clusterConf || {})}
      />
    </SectionBox>
  );
}
