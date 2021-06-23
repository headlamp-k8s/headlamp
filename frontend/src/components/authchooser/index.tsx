import chevronLeft from '@iconify/icons-mdi/chevron-left';
import { InlineIcon } from '@iconify/react';
import { Box, Button, DialogTitle, withStyles } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { generatePath, useHistory, useLocation } from 'react-router-dom';
import helpers from '../../helpers';
import { useClustersConf } from '../../lib/k8s';
import { testAuth } from '../../lib/k8s/apiProxy';
import { createRouteURL, getRoute, getRoutePath } from '../../lib/router';
import { getCluster, getClusterPrefixedPath } from '../../lib/util';
import { setConfig } from '../../redux/actions/actions';
import { ClusterDialog } from '../cluster/Chooser';
import { Loader } from '../common';
import Empty from '../common/EmptyContent';
import OauthPopup from '../oidcauth/OauthPopup';

const ColorButton = withStyles(theme => ({
  root: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.sidebarBg,
    width: '14rem',
    padding: '0.5rem 2rem',
    '&:hover': {
      opacity: '0.8',
      backgroundColor: theme.palette.sidebarBg,
    },
  },
}))(Button);

interface ReactRouterLocationStateIface {
  from?: Location;
}

export interface AuthChooserProps {
  children?: React.ReactNode;
}

function AuthChooser({ children }: AuthChooserProps) {
  const history = useHistory();
  const location = useLocation();
  const clusters = useClustersConf();
  const dispatch = useDispatch();
  const [testingAuth, setTestingAuth] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const { from = { pathname: createRouteURL('cluster') } } = (location.state ||
    {}) as ReactRouterLocationStateIface;
  const clusterName = getCluster() as string;
  const { t } = useTranslation('auth');

  let clusterAuthType = '';
  if (clusters && clusters[clusterName]) {
    clusterAuthType = clusters[clusterName].auth_type;
  }

  const numClusters = Object.keys(clusters || {}).length;

  React.useEffect(
    () => {
      const clusterName = getCluster();
      if (!clusterName || !clusters || error || numClusters === 0) {
        return;
      }

      const cluster = clusters[clusterName];
      if (!cluster) {
        return;
      }

      let cancelled = false;

      // If we haven't yet figured whether we need to use a token for the current
      //   cluster, then we check here.
      // With clusterAuthType == oidc,
      //   they are presented with a choice of login or enter token.
      if (clusterAuthType !== 'oidc' && cluster.useToken === undefined) {
        let useToken = true;

        setTestingAuth(true);

        let errorObj: Error | null = null;
        setError(errorObj);

        testAuth()
          .then(() => {
            console.debug('Not requiring token as testing auth succeeded');
            useToken = false;
          })
          .catch(err => {
            if (!cancelled) {
              console.debug('Requiring token as testing auth failed:', err);

              // Ideally we'd only not assign the error if it was 401 or 403 (so we let the logic
              // proceed to request a token), but let's first check whether this is all we get
              // from clusters that require a token.
              if ([408, 504, 502].includes(err.status)) {
                errorObj = err;
              }

              setTestingAuth(false);
            }
          })
          .finally(() => {
            if (!cancelled) {
              cancelled = true;
              setTestingAuth(false);

              if (!!errorObj) {
                setError(errorObj);
                return;
              }

              cluster.useToken = useToken;
              dispatch(setConfig({ clusters: { ...clusters } }));
              // If we don't require a token, then we just move to the attempted URL or root.
              if (!useToken) {
                history.replace(from);
              }

              // If we reach this point, then we know whether or not we need a token. If we don't,
              // just redirect.
              if (cluster.useToken === false) {
                history.replace(from);
              } else if (!clusterAuthType) {
                // we know that it requires token and also doesn't have oidc configured
                // so let's redirect to token page
                history.replace({
                  pathname: generatePath(getClusterPrefixedPath('token'), {
                    cluster: clusterName as string,
                  }),
                });
              }
            }
          });
      } else if (cluster.useToken) {
        history.replace({
          pathname: generatePath(getClusterPrefixedPath('token'), {
            cluster: clusterName as string,
          }),
        });
      }

      return function cleanup() {
        cancelled = true;
      };
    },
    // eslint-disable-next-line
    [clusters, error]
  );

  return (
    <PureAuthChooser
      testingTitle={
        numClusters > 1
          ? t('Getting auth info: {{ clusterName }}', { clusterName })
          : t('Getting auth info')
      }
      testingAuth={testingAuth}
      title={
        numClusters > 1
          ? t('Authentication: {{ clusterName }}', { clusterName })
          : t('Authentication')
      }
      haveClusters={!!clusters && Object.keys(clusters).length > 1}
      error={error}
      oauthUrl={`${helpers.getAppUrl()}oidc?dt=${Date()}&cluster=${getCluster()}`}
      clusterAuthType={clusterAuthType}
      handleTryAgain={() => setError(null)}
      handleOidcAuth={() => {
        history.replace({
          pathname: generatePath(getClusterPrefixedPath(), {
            cluster: clusterName as string,
          }),
        });
      }}
      handleBackButtonPress={() => {
        history.goBack();
      }}
      handleTokenAuth={() => {
        history.push({
          pathname: generatePath(getRoutePath(getRoute('token')), {
            cluster: clusterName as string,
          }),
        });
      }}
    >
      {children}
    </PureAuthChooser>
  );
}

export interface PureAuthChooserProps {
  title: string;
  testingTitle: string;
  testingAuth: boolean;
  error: Error | null;
  oauthUrl: string;
  clusterAuthType: string;
  haveClusters: boolean;
  handleOidcAuth: () => void;
  handleTokenAuth: () => void;
  handleTryAgain: () => void;
  handleBackButtonPress: () => void;
  children?: React.ReactNode;
}

export function PureAuthChooser({
  title,
  testingTitle,
  testingAuth,
  error,
  oauthUrl,
  clusterAuthType,
  haveClusters,
  handleOidcAuth,
  handleTokenAuth,
  handleTryAgain,
  handleBackButtonPress,
  children,
}: PureAuthChooserProps) {
  const { t } = useTranslation('auth');

  const focusedRef = React.useCallback(node => {
    if (node !== null) {
      node.setAttribute('tabindex', '-1');
      node.focus();
    }
  }, []);

  return (
    <ClusterDialog
      useCover
      disableEscapeKeyDown
      disableBackdropClick
      aria-labelledby="authchooser-dialog-title"
    >
      {testingAuth ? (
        <Box textAlign="center">
          <DialogTitle ref={focusedRef} id="authchooser-dialog-title">
            {testingTitle}
          </DialogTitle>
          <Loader title={t('Testing auth')} />
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center">
          <DialogTitle ref={focusedRef} id="authchooser-dialog-title">
            {title}
          </DialogTitle>
          {!error ? (
            <Box>
              {clusterAuthType === 'oidc' ? (
                <Box m={2}>
                  <OauthPopup
                    onCode={handleOidcAuth}
                    url={oauthUrl}
                    title={t('Headlamp Cluster Authentication')}
                    button={ColorButton as typeof Button}
                  >
                    {t('Sign In') as string}
                  </OauthPopup>
                </Box>
              ) : null}
              <Box m={2}>
                <ColorButton onClick={handleTokenAuth}>{t('Use A Token')}</ColorButton>
              </Box>
            </Box>
          ) : (
            <Box alignItems="center" textAlign="center">
              <Box m={2}>
                <Empty>
                  {t('Failed to get authentication information: {{ errorMessage }}', {
                    errorMessage: error!.message,
                  })}
                </Empty>
              </Box>
              <ColorButton onClick={handleTryAgain}>{t('frequent|Try Again')}</ColorButton>
            </Box>
          )}
        </Box>
      )}
      {haveClusters && (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box
            m={2}
            display="flex"
            alignItems="center"
            style={{ cursor: 'pointer' }}
            onClick={handleBackButtonPress}
            role="button"
          >
            <Box pt={0.5}>
              <InlineIcon icon={chevronLeft} height={20} width={20} />
            </Box>
            <Box fontSize={14} style={{ textTransform: 'uppercase' }}>
              {t('frequent|Back')}
            </Box>
          </Box>
        </Box>
      )}
      {children}
    </ClusterDialog>
  );
}

export default AuthChooser;
