import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import { Location } from 'history';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { setToken } from '../../lib/auth';
import { useClustersConf } from '../../lib/k8s';
import { testAuth } from '../../lib/k8s/apiProxy';
import { createRouteURL } from '../../lib/router';
import { getCluster } from '../../lib/util';
import { setConfig } from '../../redux/actions/actions';
import { ClusterDialog } from '../cluster/Chooser';
import { Loader } from '../common';

interface ReactRouterLocationStateIface {
  from?: Location;
}

function Auth() {
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const clusterConf = useClustersConf();
  const {from = { pathname: createRouteURL('cluster') }} = (location.state || {}) as ReactRouterLocationStateIface;
  const [token, setToken] = React.useState('');
  const [testingAuth, setTestingAuth] = React.useState(false);
  const [showError, setShowError] = React.useState(false);
  const clusters = useClustersConf();

  function onAuthClicked() {
    loginWithToken(token).then(code => {
      // If successful, redirect.
      if (code === 200) {
        history.replace(from);
      } else {
        setToken('');
        setShowError(true);
      }
    });
  }

  React.useEffect(() => {
    const clusterName = getCluster();
    if (!clusterName || testingAuth || Object.keys(clusterConf).length === 0) {
      return;
    }

    const cluster = clusterConf[clusterName];
    if (!cluster) {
      history.replace(createRouteURL('chooser'));
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
          dispatch(setConfig({clusters: {...clusterConf}}));

          // If we don't require a token, then we just move to the attempted URL or root.
          if (!useToken) {
            history.replace(from);
          }

          setTestingAuth(false);
        });

      return;
    }

    // If we reach this point, then we know whether or not we need a token. If we don't,
    // just redirect.
    if (!cluster.useToken) {
      history.replace(from);
    }

    return function cleanup () {
      setTestingAuth(false);
    };
  },
  // eslint-disable-next-line
  [clusterConf, testingAuth]);

  return (
    <Box>
      <ClusterDialog
        useCover
        disableEscapeKeyDown
        disableBackdropClick
      >
        {testingAuth ?
          <Loader />
          :
          <>
            <DialogTitle id="responsive-dialog-title">
              {Object.keys(clusterConf).length > 1 ? `Authentication: ${getCluster()}` : 'Authentication'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please paste your authentication token.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="token"
                label="ID token"
                type="password"
                value={token}
                onChange={event => setToken(event.target.value)}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              {Object.keys(clusters).length > 1 &&
              <>
                <Button onClick = {() => history.replace('/')} color="primary">
                  Cancel
                </Button>
                <div style={{flex: '1 0 0'}} />
              </>
              }
              <Button onClick={onAuthClicked} color="primary">
                Authenticate
              </Button>
            </DialogActions>
          </>
        }
      </ClusterDialog>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={showError}
        autoHideDuration={5000}
        onClose={() => { setShowError(false); }}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">Error authenticating</span>}
      />
    </Box>
  );
}

async function loginWithToken(token: string) {
  try {
    const cluster = getCluster();
    if (!cluster) {
      // Expectation failed.
      return 417;
    }

    setToken(cluster, token);

    await testAuth();

    return 200;
  } catch (err) {
    console.error(err);
    return err.status;
  }
}

export default Auth;
