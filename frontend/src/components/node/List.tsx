import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import Node from '../../lib/k8s/node';
import { HoverInfoLabel } from '../common';
import ResourceListView from '../common/Resource/ResourceListView';
import { UsageBarChart } from './Charts';
import { NodeReadyLabel } from './Details';

const useStyle = makeStyles({
  chartCell: {
    width: '20%',
  },
});

export default function NodeList() {
  const classes = useStyle();
  const [nodeMetrics, metricsError] = Node.useMetrics();
  const { t } = useTranslation(['glossary', 'translation']);

  const noMetrics = metricsError?.status === 404;

  return (
    <ResourceListView
      title={t('Nodes')}
      headerProps={{
        noNamespaceFilter: true,
      }}
      resourceClass={Node}
      columns={[
        'name',
        {
          id: 'ready',
          label: t('translation|Ready'),
          gridTemplate: 'minmax(100px, .5fr)',
          getter: node => <NodeReadyLabel node={node} />,
        },
        {
          id: 'cpu',
          label: t('CPU'),
          cellProps: {
            className: classes.chartCell,
          },
          getter: node => (
            <UsageBarChart
              node={node}
              nodeMetrics={nodeMetrics}
              resourceType="cpu"
              noMetrics={noMetrics}
            />
          ),
        },
        {
          id: 'memory',
          label: t('Memory'),
          cellProps: {
            className: classes.chartCell,
          },
          getter: node => (
            <UsageBarChart
              node={node}
              nodeMetrics={nodeMetrics}
              resourceType="memory"
              noMetrics={noMetrics}
            />
          ),
        },
        {
          id: 'roles',
          label: t('Roles'),
          getter: node => node.metadata.labels['kubernetes.io/role'],
          gridTemplate: 'minmax(120px, .5fr)',
        },
        {
          id: 'internalIP',
          label: t('translation|Internal IP'),
          getter: node => node.getInternalIP(),
        },
        {
          id: 'externalIP',
          label: t('External IP'),
          getter: node => node.getExternalIP(),
        },
        {
          id: 'version',
          label: t('translation|Version'),
          gridTemplate: 'minmax(100px, .5fr)',
          getter: node => node.status.nodeInfo.kubeletVersion,
        },
        {
          id: 'software',
          label: t('translation|Software'),
          gridTemplate: 'minmax(200px, 1.5fr)',
          getter: node => {
            let osIcon = 'mdi:desktop-classic';
            if (node.status.nodeInfo.operatingSystem === 'linux') {
              osIcon = 'mdi:linux';
            } else if (node.status.nodeInfo.operatingSystem === 'windows') {
              osIcon = 'mdi:microsoft-windows';
            }

            return (
              <>
                <HoverInfoLabel
                  label={node.status.nodeInfo.osImage}
                  hoverInfo={t('OS image')}
                  labelProps={{ variant: 'body2' }}
                  iconPosition="start"
                  icon={osIcon}
                />
                {node.status.nodeInfo.kernelVersion && (
                  <HoverInfoLabel
                    label={node.status.nodeInfo.kernelVersion}
                    hoverInfo={t('Kernel version')}
                    labelProps={{ variant: 'body2' }}
                    iconPosition="start"
                    icon="mdi:nut"
                  />
                )}
                <HoverInfoLabel
                  label={node.status.nodeInfo.containerRuntimeVersion}
                  hoverInfo={t('Container Runtime')}
                  labelProps={{ variant: 'body2' }}
                  iconPosition="start"
                  icon="mdi:train-car-container"
                />
              </>
            );
          },
          show: false,
        },
        'age',
      ]}
    />
  );
}
