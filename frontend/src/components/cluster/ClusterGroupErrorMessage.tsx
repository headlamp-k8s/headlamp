import { InlineIcon } from '@iconify/react';
import { Box, Typography, useTheme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ApiError } from '../../lib/k8s/apiProxy';

export interface ClusterGroupErrorMessageProps {
  clusters?: string[] | { [cluster: string]: string | ApiError | null };
  message?: string;
}

export function ClusterGroupErrorMessage(props: ClusterGroupErrorMessageProps) {
  const { clusters, message } = props;
  const { t } = useTranslation(['cluster']);
  const theme = useTheme();
  const clusterObj = typeof clusters === 'object' ? clusters : {};

  if ((!clusters && !message) || Object.keys(clusterObj).length === 0) {
    return null;
  }

  return (
    <Box p={1} style={{ background: theme.palette.warning.light }}>
      <Typography style={{ color: theme.palette.warning.main }}>
        <InlineIcon icon="mdi:alert" color={theme.palette.warning.main} />
        &nbsp;
        {message ||
          (Object.keys(clusterObj).length > 2
            ? t('Failed to load resources from some of the clusters in the group.')
            : t('Failed to load resources from the following clusters: {{ clusterList }}', {
                clusterList: Object.keys(clusterObj).join(', '),
              }))}
      </Typography>
    </Box>
  );
}
