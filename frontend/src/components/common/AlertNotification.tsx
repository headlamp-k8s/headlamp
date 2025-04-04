import { Alert, Button, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { matchPath, useLocation } from 'react-router-dom';
import { testClusterHealth } from '../../lib/k8s/apiProxy';
import { getRoute, getRoutePath } from '../../lib/router';
import { getCluster } from '../../lib/util';

// in ms
const NETWORK_STATUS_CHECK_TIME = 5000;

export interface PureAlertNotificationProps {
  checkerFunction(): Promise<any>;
}

// Routes where we don't show the alert notification.
// Because maybe they already offer context about the cluster health or
// some other reason.
const ROUTES_WITHOUT_ALERT = ['login', 'token', 'settingsCluster'];

export function PureAlertNotification({ checkerFunction }: PureAlertNotificationProps) {
  const [networkStatusCheckTimeFactor, setNetworkStatusCheckTimeFactor] = React.useState(0);
  const [error, setError] = React.useState<null | string | boolean>(null);
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const performHealthCheck = React.useCallback(() => {
    if (!window.navigator.onLine) {
      setError('Offline');
      return;
    }

    // Don't check for the cluster health if we are not on a cluster route.
    if (!getCluster()) {
      setError(null);
      return;
    }

    return checkerFunction()
      .then(() => setError(false))
      .catch(err => {
        setError(err.message);
        setNetworkStatusCheckTimeFactor(prev => prev + 1);
      });
  }, []);

  React.useEffect(() => {
    const interval = setInterval(
      performHealthCheck,
      (networkStatusCheckTimeFactor + 1) * NETWORK_STATUS_CHECK_TIME
    );
    return () => clearInterval(interval);
  }, [performHealthCheck, networkStatusCheckTimeFactor]);

  // Make sure we do not show the alert notification if we are not on a cluster route.
  React.useEffect(() => {
    if (!getCluster()) {
      setError(null);
    }
  }, [pathname]);

  const showOnRoute = React.useMemo(() => {
    for (const route of ROUTES_WITHOUT_ALERT) {
      const routePath = getRoutePath(getRoute(route));
      if (matchPath(pathname, routePath)?.isExact) {
        return false;
      }
    }
    return true;
  }, [pathname]);

  if (!error || !showOnRoute) {
    return null;
  }

  return (
    <Alert
      variant="filled"
      severity="error"
      sx={theme => ({
        color: theme.palette.common.white,
        background: theme.palette.error.main,
        textAlign: 'center',
        display: 'flex',
        paddingTop: theme.spacing(0.5),
        paddingBottom: theme.spacing(1),
        paddingRight: theme.spacing(3),
        justifyContent: 'center',
        position: 'fixed',
        zIndex: theme.zIndex.snackbar + 1,
        top: '0',
        alignItems: 'center',
        left: '50%',
        width: 'auto',
        transform: 'translateX(-50%)',
      })}
      action={
        <Button
          sx={theme => ({
            color: theme.palette.error.main,
            borderColor: theme.palette.error.main,
            background: theme.palette.common.white,
            lineHeight: theme.typography.body2.lineHeight,
            '&:hover': {
              color: theme.palette.common.white,
              borderColor: theme.palette.common.white,
              background: theme.palette.error.dark,
            },
          })}
          onClick={performHealthCheck}
          size="small"
        >
          {t('translation|Try Again')}
        </Button>
      }
    >
      <Typography
        variant="body2"
        sx={theme => ({
          paddingTop: theme.spacing(0.5),
          fontWeight: 'bold',
          fontSize: '16px',
        })}
      >
        {t('translation|Lost connection to the cluster.')}
      </Typography>
    </Alert>
  );
}

export default function AlertNotification() {
  return <PureAlertNotification checkerFunction={testClusterHealth} />;
}
