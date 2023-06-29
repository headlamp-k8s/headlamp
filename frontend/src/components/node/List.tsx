import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Node from '../../lib/k8s/node';
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
  const { t } = useTranslation('glossary');

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
          label: t('frequent|Ready'),
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
          id: 'version',
          label: t('Version'),
          getter: node => node.status.nodeInfo.kubeletVersion,
        },
        'age',
      ]}
    />
  );
}
