import { Box, useTheme } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { matchPath, useLocation } from 'react-router-dom';
import { testAuth } from '../../lib/k8s/apiProxy';
import { getDefaultRoutes, getRoutePath, Route } from '../../lib/router';
import { useTypedSelector } from '../../redux/reducers/reducers';

const NOT_FOUND_ERROR_MESSAGES = ['Error: Api request error: Bad Gateway', 'Offline'];
// in ms
const NETWORK_STATUS_CHECK_TIME = 5000;

export interface PureAlertNotificationProps {
  routes: { [path: string]: any };
  moreRoutes: { [routeName: string]: Route };
  testAuth(): Promise<any>;
}

export function PureAlertNotification({
  routes,
  testAuth,
  moreRoutes,
}: PureAlertNotificationProps) {
  const [networkStatusCheckTimeFactor, setNetworkStatusCheckTimeFactor] = React.useState(0);
  const [error, setError] = React.useState<null | string | boolean>(null);
  const [intervalID, setIntervalID] = React.useState<NodeJS.Timeout | null>(null);
  const { t } = useTranslation('resource');
  const theme = useTheme();
  const { pathname } = useLocation();

  function registerSetInterval(): NodeJS.Timeout {
    return setInterval(() => {
      if (!window.navigator.onLine) {
        setError(t('frequent|Offline') as string);
        return;
      }
      setError(null);
      testAuth()
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

  function checkWhetherInNoAuthRequireRoute(): boolean {
    const noAuthRequiringRoutes = Object.values(moreRoutes)
      .concat(Object.values(routes))
      .filter(route => route.noAuthRequired);

    for (const route of noAuthRequiringRoutes) {
      const routeMatch = matchPath(pathname, {
        path: getRoutePath(route),
        strict: true,
      });

      if (routeMatch && routeMatch.isExact) {
        return true;
      }
    }
    return false;
  }

  const whetherInNoAuthRoute = checkWhetherInNoAuthRequireRoute();
  let isErrorInNoAuthRequiredRoute = false;
  if (whetherInNoAuthRoute) {
    isErrorInNoAuthRequiredRoute = true;
  }
  if (!error) {
    return null;
  }

  if (NOT_FOUND_ERROR_MESSAGES.filter(err => err === error).length === 0) {
    return null;
  }
  return (
    <Box
      bgcolor="error.main"
      color={theme.palette.common.white}
      textAlign="center"
      display="flex"
      p={1}
      justifyContent="center"
      position="fixed"
      zIndex={1400}
      width="100%"
      top={'0'}
      height={'3.8vh'}
    >
      <Box marginLeft={isErrorInNoAuthRequiredRoute ? '0%' : '-15%'}>
        {t('Something Went Wrong.')}
      </Box>
      <Box
        bgcolor={theme.palette.common.white}
        color="error.main"
        ml={1}
        px={1}
        py={0.1}
        style={{ cursor: 'pointer' }}
        onClick={() => setNetworkStatusCheckTimeFactor(0)}
      >
        {t('frequent|Try Again')}
      </Box>
    </Box>
  );
}

export default function AlertNotification() {
  const routes = useTypedSelector(state => state.ui.routes);

  return (
    <PureAlertNotification routes={routes} testAuth={testAuth} moreRoutes={getDefaultRoutes()} />
  );
}
