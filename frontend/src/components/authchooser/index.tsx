import chevronLeft from '@iconify/icons-mdi/chevron-left';
import { InlineIcon } from '@iconify/react';
import { Box, Button, DialogTitle, withStyles } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { generatePath, useHistory, useLocation } from 'react-router-dom';
import { isElectron } from '../../helpers';
import { useClustersConf } from '../../lib/k8s';
import { testAuth } from '../../lib/k8s/apiProxy';
import { createRouteURL, getRoute, getRoutePath } from '../../lib/router';
import { getCluster, getClusterPrefixedPath } from '../../lib/util';
import { setConfig } from '../../redux/actions/actions';
import { ClusterDialog } from '../cluster/Chooser';
import { Loader } from '../common';
import OauthPopup from '../oidcauth/OauthPopup';

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.sidebarBg,
    width: '14rem',
    padding: '0.5rem 2rem',
    '&:hover': {
      opacity: '0.8',
      backgroundColor: theme.palette.sidebarBg
    }
  },
}))(Button);

interface ReactRouterLocationStateIface {
  from?: Location;
}

function AuthChooser(){
  const history = useHistory();
  const location = useLocation();
  const {clusters} = useClustersConf();
  const dispatch = useDispatch();
  const isDevMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
  const [testingAuth, setTestingAuth] = React.useState(false);
  const {from = { pathname: createRouteURL('cluster') }} = (location.state || {}) as ReactRouterLocationStateIface;
  const clusterName = getCluster() as string;

  let clusterAuthType = '';
  if (clusters[clusterName]) {
    clusterAuthType = clusters[clusterName].auth_type;
  }

  function handleTokenAuth() {
    history.push({
      pathname: generatePath(getRoutePath(getRoute('token')), {cluster: clusterName as string}),
    });
  }

  function handleOidcAuth() {
    history.replace({
      pathname: generatePath(getClusterPrefixedPath(), {cluster: clusterName as string}),
    });
  }

  function handleBackButtonPress(){
    history.goBack();
  }

  React.useEffect(() => {
    const clusterName = getCluster();
    if (!clusterName || testingAuth || Object.keys(clusters).length === 0) {
      return;
    }

    const cluster = clusters[clusterName];
    if (!cluster) {
      return;
    }

    // If we haven't yet figured whether we need to use a token for the current
    // cluster, then we check here.
    if (cluster.useToken === undefined) {
      let useToken = true;

      setTestingAuth(true);

      testAuth()
        .then(() => {
          console.debug('Not requiring token as testing auth succeeded');
          useToken = false;
        })
        .catch((err) => {
          console.debug('Requiring token as testing auth failed:', err);
          useToken = true;
        })
        .finally(() => {
          cluster.useToken = useToken;
          dispatch(setConfig({clusters: {...clusters}}));
          // If we don't require a token, then we just move to the attempted URL or root.
          if (!useToken) {
            history.replace(from);
          }

          setTestingAuth(false);
        });
      if (!clusterAuthType && useToken){
        history.replace({
          pathname: generatePath(getClusterPrefixedPath('token'), {cluster: clusterName as string}),
        });
      }
      return;
    }

    // If we reach this point, then we know whether or not we need a token. If we don't,
    // just redirect.
    if (!cluster.useToken) {
      history.replace(from);
    } else if (!clusterAuthType){
      // we know that it requires token and also doesn't have oidc configured
      // so let's redirect to token page
      history.replace({
        pathname: generatePath(getClusterPrefixedPath('token'), {cluster: clusterName as string}),
      });
    }

    return function cleanup () {
      setTestingAuth(false);
    };
  },
  // eslint-disable-next-line
  [clusters, testingAuth]);

  return (
    <ClusterDialog
      useCover
      disableEscapeKeyDown
      disableBackdropClick
    >
      {testingAuth ? <Loader/> :
      <Box display="flex" flexDirection="column" alignItems="center">
        <DialogTitle>
          Authentication
        </DialogTitle>
        <Box>
          {
            clusterAuthType === 'oidc' ?
              <Box m={2}>
                <OauthPopup onCode={handleOidcAuth}
                  url={`${isDevMode || isElectron() ?
                    'http://localhost:4466/' : '/'}oidc?dt=${Date()}&cluster=${getCluster()}`
                  }
                  title="Headlamp Cluster Authentication"
                >
                  <ColorButton>Sign In</ColorButton>
                </OauthPopup>
              </Box>
              : null
          }
          <Box m={2}>
            <ColorButton onClick={handleTokenAuth}>Use A Token</ColorButton>
          </Box>
        </Box>
        <Box m={2} display="flex" alignItems="center" style={{cursor: 'pointer'}} onClick={handleBackButtonPress}>
          <Box pt={0.5}>
            <InlineIcon icon={chevronLeft} height={20} width={20}/>
          </Box>
          <Box fontSize={14}>BACK</Box>
        </Box>
      </Box>
      }
    </ClusterDialog>
  );
}

export default AuthChooser;
