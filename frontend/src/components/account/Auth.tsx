import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Link from '@material-ui/core/Link';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { generatePath, useHistory } from 'react-router-dom';
import { setToken } from '../../lib/auth';
import { useClustersConf } from '../../lib/k8s';
import { ApiError, testAuth } from '../../lib/k8s/apiProxy';
import { getCluster, getClusterPrefixedPath } from '../../lib/util';
import { ClusterDialog } from '../cluster/Chooser';
import { DialogTitle } from '../common/Dialog';

export default function AuthToken() {
  const history = useHistory();
  const clusterConf = useClustersConf();
  const [token, setToken] = React.useState('');
  const [showError, setShowError] = React.useState(false);
  const clusters = useClustersConf();
  const { t } = useTranslation(['auth']);

  function onAuthClicked() {
    loginWithToken(token).then(code => {
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
          ? t('Authentication: {{ clusterName }}', { clusterName: getCluster() })
          : t('Authentication')
      }
      token={token}
      showError={showError}
      showActions={Object.keys(clusters || {}).length > 1}
      onChangeToken={(event: React.ChangeEvent<HTMLInputElement>) => setToken(event.target.value)}
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
  const { t } = useTranslation('auth');
  const focusedRef = React.useCallback(node => {
    if (node !== null) {
      // node.setAttribute('tabindex', '-1');
      node.focus();
    }
  }, []);

  function onClose() {
    // Do nothing because we're not supposed to close on backdrop click
  }

  return (
    <Box component="main">
      <ClusterDialog useCover onClose={onClose} aria-labelledby="authtoken-dialog-title">
        <DialogTitle id="authtoken-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Trans t={t}>Please paste your authentication token.</Trans>
          </DialogContentText>
          <TextField
            margin="dense"
            id="token"
            label={t('ID token')}
            type="password"
            value={token}
            onChange={onChangeToken}
            fullWidth
            ref={focusedRef}
          />
        </DialogContent>
        <DialogActions>
          <Box ml={2}>
            <Trans t={t}>
              Check out how to generate a
              <Link
                style={{ cursor: 'pointer', marginLeft: '0.4rem' }}
                target="_blank"
                href="https://kinvolk.github.io/headlamp/docs/latest/installation/#create-a-service-account-token"
              >
                service account token
              </Link>
              .
            </Trans>
          </Box>
          <div style={{ flex: '1 0 0' }}></div>
        </DialogActions>
        <DialogActions>
          {showActions && (
            <>
              <Button onClick={onCancel} color="primary">
                {t('frequent|Cancel')}
              </Button>
              <div style={{ flex: '1 0 0' }} />
            </>
          )}
          <Button onClick={onAuthClicked} color="primary">
            {t('auth|Authenticate')}
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
        message={<span id="message-id">{t('auth|Error authenticating')}</span>}
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
    return (err as ApiError).status;
  }
}
