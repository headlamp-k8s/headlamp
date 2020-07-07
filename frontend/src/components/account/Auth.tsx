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
import { useHistory, useLocation } from 'react-router-dom';
import { setToken } from '../../lib/auth';
import { useClustersConf } from '../../lib/k8s';
import { post } from '../../lib/k8s/apiProxy';
import { getCluster } from '../../lib/util';
import { ClusterDialog } from '../cluster/Chooser';

interface ReactRouterLocationStateIface {
  from?: Location;
}

function Auth() {
  const location = useLocation();
  const history = useHistory();
  const clusterConf = useClustersConf();
  const {from = { pathname: '/' }} = location.state as ReactRouterLocationStateIface;
  const [token, setToken] = React.useState('');
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

  return (
    <Box>
      <ClusterDialog
        useCover
        disableEscapeKeyDown
        disableBackdropClick
      >
        <DialogTitle id="responsive-dialog-title">{clusterConf.length > 1 ? `Authentication: ${getCluster()}` : 'Authentication'}</DialogTitle>
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
          {clusters.length > 1 &&
            <>
              <Button href="/" color="primary">
                Cancel
              </Button>
              <div style={{flex: '1 0 0'}} />
            </>
          }
          <Button onClick={onAuthClicked} color="primary">
            Authenticate
          </Button>
        </DialogActions>
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

    const spec = {namespace: 'default'};
    await post('/apis/authorization.k8s.io/v1/selfsubjectrulesreviews', {spec}, false);

    return 200;
  } catch (err) {
    console.error(err);
    return err.status;
  }
}

export default Auth;
