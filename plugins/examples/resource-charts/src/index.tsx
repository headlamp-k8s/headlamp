import { registerAppBarAction } from '@kinvolk/headlamp-plugin/lib';
import { CircularChart } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import Pod from '@kinvolk/headlamp-plugin/lib/lib/k8s/pod';
import { Box, Paper } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

function PodFailureChart() {
  const { t } = useTranslation();
  const [pods, error] = Pod.useList();

  // Calculate failed pods
  const failedPods = (pods || []).filter(pod => {
    const phase = pod.status?.phase;
    return phase === 'Failed' || phase === 'Unknown';
  });

  // Create legend text
  const getLegend = (used: number, available: number) => {
    if (available === 0) {
      return t('No pods found');
    }
    return t('{{ failed }} failed / {{ total }} total', {
      failed: used,
      total: available,
    });
  };

  if (error) {
    return (
      <Box p={2}>
        <Paper>
          <Box p={2}>{t('Error loading pods: {{ error }}', { error: error.message })}</Box>
        </Paper>
      </Box>
    );
  }

  const totalPods = pods?.length || 0;

  return (
    <Box p={2}>
      <Paper>
        <Box p={2}>
          <CircularChart
            title={t('Pod Health')}
            items={pods || []}
            itemsMetrics={null}
            noMetrics={false}
            resourceUsedGetter={() => failedPods.length}
            resourceAvailableGetter={() => totalPods}
            getLegend={getLegend}
          />
        </Box>
      </Paper>
    </Box>
  );
}

// Register the chart as an AppBar action
registerAppBarAction(() => ({
  name: 'pod-failure-chart',
  component: PodFailureChart,
  priority: 0,
}));
