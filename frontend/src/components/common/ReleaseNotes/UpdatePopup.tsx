import { Icon } from '@iconify/react';
import { Box, Button, Snackbar } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiSnackbarContent-root': {
      backgroundColor: 'rgb(49, 49, 49)',
      color: '#fff',
    },
  },
}));

function UpdatePopup(props: {
  releaseDownloadURL?: string | null;
  fetchingRelease?: boolean;
  releaseFetchFailed?: boolean;
  skipUpdateHandler: () => void;
}) {
  const classes = useStyles();
  const [show, setShow] = React.useState(true);
  const { releaseDownloadURL, fetchingRelease, releaseFetchFailed, skipUpdateHandler } = props;
  const { t } = useTranslation();

  if (fetchingRelease && !releaseDownloadURL) {
    return (
      <Snackbar
        className={classes.root}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        autoHideDuration={5000}
        message={t('translation|Fetching release information…')}
        ContentProps={{
          'aria-describedby': 'updatePopup',
        }}
        open={fetchingRelease}
        action={
          <React.Fragment>
            <Button
              style={{
                color: 'rgb(255, 242, 0)',
              }}
              onClick={() => {
                skipUpdateHandler();
              }}
            >
              {t('translation|Skip')}
            </Button>
          </React.Fragment>
        }
      />
    );
  }

  if (releaseFetchFailed && !releaseDownloadURL) {
    return (
      <Snackbar
        className={classes.root}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={releaseFetchFailed}
        message={t('translation|Failed to fetch release information')}
        ContentProps={{
          'aria-describedby': 'updatePopup',
        }}
        autoHideDuration={6000}
      />
    );
  }

  if (!releaseDownloadURL) {
    return null;
  }

  if (fetchingRelease && !releaseDownloadURL) {
    return (
      <Snackbar
        className={classes.root}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        autoHideDuration={5000}
        message={t('translation|Fetching release information…')}
        ContentProps={{
          'aria-describedby': 'updatePopup',
        }}
        open={fetchingRelease}
        action={
          <React.Fragment>
            <Button
              style={{
                color: 'rgb(255, 242, 0)',
              }}
              onClick={() => {
                skipUpdateHandler();
              }}
            >
              {t('translation|Skip')}
            </Button>
          </React.Fragment>
        }
      />
    );
  }

  if (releaseFetchFailed && !releaseDownloadURL) {
    return (
      <Snackbar
        className={classes.root}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={releaseFetchFailed}
        message={t('translation|Failed to fetch release information')}
        ContentProps={{
          'aria-describedby': 'updatePopup',
        }}
        autoHideDuration={6000}
      />
    );
  }

  if (!releaseDownloadURL) {
    return null;
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      className={classes.root}
      open={show}
      autoHideDuration={100000}
      ContentProps={{
        'aria-describedby': 'updatePopup',
      }}
      message={t('translation|An update is available')}
      action={
        <React.Fragment>
          <Box display={'flex'} alignItems="center">
            <Box ml={-1}>
              <Button
                onClick={() => window.open(releaseDownloadURL)}
                style={{
                  color: 'inherit',
                  textTransform: 'none',
                }}
              >
                {t('translation|Read more')}
              </Button>
            </Box>
            <Box mb={0.5}>
              <Button
                style={{
                  color: 'rgb(255, 242, 0)',
                }}
                onClick={() => {
                  localStorage.setItem('disable_update_check', 'true');
                  setShow(false);
                }}
              >
                <Icon icon={'mdi:bell-off-outline'} width="20" />
              </Button>
            </Box>
            <Box>
              <Button
                style={{
                  color: 'rgb(255, 242, 0)',
                }}
                onClick={() => setShow(false)}
              >
                {t('translation|Dismiss')}
              </Button>
            </Box>
          </Box>
        </React.Fragment>
      }
    />
  );
}

UpdatePopup.defaultProps = {
  open: true,
};

export default UpdatePopup;
