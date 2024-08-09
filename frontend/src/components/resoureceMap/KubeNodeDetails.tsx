import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { useConnectApi } from '../../lib/k8s';
import { metrics } from '../../lib/k8s/apiProxy';
import { KubeMetrics } from '../../lib/k8s/cluster';
import { ResourceLink } from '../common';
import { GraphNode } from './GraphModel';

const useMetrics = () => {
  const [podMetrics, setPodsMetrics] = useState<KubeMetrics[] | null>(null);

  function setMetrics(metrics: KubeMetrics[]) {
    setPodsMetrics(metrics);
  }

  useConnectApi(metrics.bind(null, '/apis/metrics.k8s.io/v1beta1/pods', setMetrics, () => {}));

  return podMetrics;
};

export function KubeNodeDetails({ node }: { node: GraphNode }) {
  const resource = node.data.resource;

  const metricsData = useMetrics();

  const podMetric = metricsData?.find(metric => metric.metadata.name === resource?.metadata.name);

  return (
    <Box>
      <Typography variant="h6">{resource?.kind}</Typography>
      <ResourceLink resource={resource} />
      {podMetric && (
        <Typography variant="body2">
          CPU: {podMetric.containers[0].usage.cpu}, Memory: {podMetric.containers[0].usage.memory}
        </Typography>
      )}
    </Box>
  );
}
