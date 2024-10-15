import { InlineIcon } from '@iconify/react';
import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ApiError } from '../../lib/k8s/apiProxy';

export interface ClusterGroupErrorMessageProps {
  /**
   * A message to display when clusters fail to load resources.
   * This is used if it is passed in, otherwise a message made from clusterErrors is used.
   */
  message?: string;
  /**
   * Either an array of errors, or keyed by cluster name, valued by the error for that cluster.
   */
  clusterErrors?: { [cluster: string]: string | ApiError | null };
}

/**
 * filter out null errors
 * @returns errors, but without any that have null values.
 */
function cleanNullErrors(errors: ClusterGroupErrorMessageProps['clusterErrors']) {
  if (!errors) {
    return {};
  }
  const cleanedErrors: ClusterGroupErrorMessageProps['clusterErrors'] = {};
  Object.entries(errors).forEach(([cluster, error]) => {
    if (error !== null) {
      cleanedErrors[cluster] = error;
    }
  });

  return cleanedErrors;
}

export function ClusterGroupErrorMessage({
  clusterErrors,
  message,
}: ClusterGroupErrorMessageProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const clusterObj = cleanNullErrors(typeof clusterErrors === 'object' ? clusterErrors : {});

  if ((!clusterErrors && !message) || Object.keys(clusterObj).length === 0) {
    return null;
  }

  return (
    <Box p={1} style={{ background: theme.palette.warning.light }}>
      <Typography style={{ color: theme.palette.warning.main }}>
        <InlineIcon icon="mdi:alert" color={theme.palette.warning.main} />
        &nbsp;
        <>{message}</>
        {!message &&
          (Object.keys(clusterObj).length > 2
            ? t('Failed to load resources from some of the clusters in the group.')
            : t('Failed to load resources from the following clusters: {{ clusterList }}', {
                clusterList: Object.keys(clusterObj).join(', '),
              }))}
      </Typography>
    </Box>
  );
}
