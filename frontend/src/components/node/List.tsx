import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Node from '../../lib/k8s/node';
import ResourceTable from '../common/Resource/ResourceTable';
import { SectionBox } from '../common/SectionBox';
import SectionFilterHeader from '../common/SectionFilterHeader';
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
    <SectionBox title={<SectionFilterHeader title={t('Nodes')} noNamespaceFilter />}>
      <ResourceTable
        resourceClass={Node}
        columns={[
          'name',
          {
            label: t('frequent|Ready'),
            getter: node => <NodeReadyLabel node={node} />,
          },
          {
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
          'age',
        ]}
      />
    </SectionBox>
  );
}
