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
import { generatePath, useHistory } from 'react-router-dom';
import { setToken } from '../../lib/auth';
import { useClustersConf } from '../../lib/k8s';
import { testAuth } from '../../lib/k8s/apiProxy';
import { getCluster, getClusterPrefixedPath } from '../../lib/util';
import { ClusterDialog } from '../cluster/Chooser';

interface ReactRouterLocationStateIface {
  from?: Location;
}

export default function AuthToken() {
  const history = useHistory();
  const clusterConf = useClustersConf();
  const [token, setToken] = React.useState('');
  const [showError, setShowError] = React.useState(false);
  const clusters = useClustersConf();

  function onAuthClicked() {
    loginWithToken(token).then((code) => {
      // If successful, redirect.
      if (code === 200) {
        history.replace(
          generatePath(getClusterPrefixedPath(), {
            cluster: getCluster() as string,
          })
        );
      } else {
        setToken('');
        setShowError(true);
      }
    });
  }

  return (
    <PureAuthToken
      onCancel={() => history.replace('/')}
      title={
        Object.keys(clusterConf || {}).length > 1
          ? `Authentication: ${getCluster()}`
          : 'Authentication'
      }
      token={token}
      showError={showError}
      showActions={Object.keys(clusters || {}).length > 1}
      onChangeToken={(event: React.ChangeEvent<HTMLInputElement>) =>
        setToken(event.target.value)
      }
      onAuthClicked={onAuthClicked}
      onCloseError={() => {
        setShowError(false);
      }}
    />
  );
}

interface clickCallbackType {
  (event: React.MouseEvent<HTMLElement>): void;
}
interface changeCallbackType {
  (event: React.ChangeEvent<HTMLInputElement>): void;
}

export interface PureAuthTokenProps {
  title: string;
  token: string;
  showActions: boolean;
  showError: boolean;
  onCancel: clickCallbackType;
  onChangeToken: changeCallbackType;
  onAuthClicked: clickCallbackType;
  onCloseError: (event: React.SyntheticEvent<any, Event>, reason: string) => void;
}

export function PureAuthToken({
  title,
  token,
  showActions,
  showError,
  onCancel,
  onAuthClicked,
  onChangeToken,
  onCloseError,
}: PureAuthTokenProps) {
  return (
    <Box>
      <ClusterDialog useCover disableEscapeKeyDown disableBackdropClick>
        <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
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
            onChange={onChangeToken}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          {showActions && (
            <>
              <Button onClick={onCancel} color="primary">
                Cancel
              </Button>
              <div style={{ flex: '1 0 0' }} />
            </>
          )}
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
        onClose={onCloseError}
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
