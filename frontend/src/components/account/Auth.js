import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import { useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import api from '../../lib/api';
import { setToken } from '../../lib/auth';

function Auth() {
  const location = useLocation();
  const history = useHistory();
  const {from} = location.state || { from: { pathname: '/' }};
  const [token, setToken] = React.useState('');
  const [showError, setShowError] = React.useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  function onAuthClicked() {
    loginWithToken(token).then(code => {
      // If successful, redirect.
      if (code == 200) {
        history.replace(from);
      } else {
        setToken('');
        setShowError(true);
      }
    });
  }

  function handleTokenChange(event) {
    setToken(event.target.value);
  }

  return (
    <Box>
      <Dialog
        fullScreen={fullScreen}
        open
        aria-labelledby="authentication-dialog"
      >
        <DialogTitle id="responsive-dialog-title">{'Welcome'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please paste your authentication token, in order to access the dashboard.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="token"
            label="ID token"
            type="password"
            value={token}
            onChange={handleTokenChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onAuthClicked} color="primary">
            Authenticate
          </Button>
        </DialogActions>
      </Dialog>
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

async function loginWithToken(token) {
  try {
    setToken(token);
    await api.testAuth();

    return 200;
  } catch (err) {
    console.error(err);
    return err.status;
  }
}

export default Auth;
