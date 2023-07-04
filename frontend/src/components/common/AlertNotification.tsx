import { Box, Button, makeStyles } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { matchPath, useLocation } from 'react-router-dom';
import { testClusterHealth } from '../../lib/k8s/apiProxy';
import { getRoute, getRoutePath } from '../../lib/router';
import { useSidebarInfo } from '../Sidebar';

// in ms
const NETWORK_STATUS_CHECK_TIME = 5000;

export interface PureAlertNotificationProps {
  checkerFunction(): Promise<any>;
}

const useStyle = makeStyles(theme => ({
  box: {
    color: theme.palette.common.white,
    textAlign: 'center',
    display: 'flex',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(0.5),
    justifyContent: 'center',
    position: 'fixed',
    zIndex: theme.zIndex.snackbar + 1,
    width: '100%',
    top: '0',
    height: '3.8vh',
  },
  button: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    background: theme.palette.common.white,
    lineHeight: '1',
    marginLeft: theme.spacing(1),
    '&:hover': {
      color: theme.palette.common.white,
      borderColor: theme.palette.common.white,
      background: theme.palette.error.dark,
    },
  },
}));

// Routes where we don't show the alert notification.
// Because maybe they already offer context about the cluster health or
// some other reason.
const ROUTES_WITHOUT_ALERT = ['login', 'token', 'settingsCluster'];

export function PureAlertNotification({ checkerFunction }: PureAlertNotificationProps) {
  const { width: sidebarWidth } = useSidebarInfo();
  const [networkStatusCheckTimeFactor, setNetworkStatusCheckTimeFactor] = React.useState(0);
  const [error, setError] = React.useState<null | string | boolean>(null);
  const [intervalID, setIntervalID] = React.useState<NodeJS.Timeout | null>(null);
  const { t } = useTranslation('resource');
  const { pathname } = useLocation();
  const classes = useStyle();

  function registerSetInterval(): NodeJS.Timeout {
    return setInterval(() => {
      if (!window.navigator.onLine) {
        setError(t('frequent|Offline') as string);
        return;
      }

      checkerFunction()
        .then(() => {
          setError(false);
        })
        .catch(err => {
          const error = new Error(err);
          setError(error.message);
          setNetworkStatusCheckTimeFactor(
            (networkStatusCheckTimeFactor: number) => networkStatusCheckTimeFactor + 1
          );
        });
    }, (networkStatusCheckTimeFactor + 1) * NETWORK_STATUS_CHECK_TIME);
  }

  React.useEffect(
    () => {
      const id = registerSetInterval();
      setIntervalID(id);
      return () => clearInterval(id);
    },
    // eslint-disable-next-line
    []
  );

  React.useEffect(
    () => {
      if (intervalID) {
        clearInterval(intervalID);
      }
      const id = registerSetInterval();
      setIntervalID(id);
      return () => clearInterval(id);
    },
    // eslint-disable-next-line
    [networkStatusCheckTimeFactor]
  );

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
    <Box className={classes.box} bgcolor="error.main" paddingRight={sidebarWidth}>
      <Box>
        {t('Something went wrong.')}
        <Button
          className={classes.button}
          onClick={() => setNetworkStatusCheckTimeFactor(0)}
          size="small"
        >
          {t('frequent|Try Again')}
        </Button>
      </Box>
    </Box>
  );
}

export default function AlertNotification() {
  return <PureAlertNotification checkerFunction={testClusterHealth} />;
}
