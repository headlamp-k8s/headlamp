import { Button, Snackbar } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

function UpdatePopup(props: {
  releaseDownloadURL?: string | null;
  fetchingRelease?: boolean;
  releaseFetchFailed?: boolean;
  skipUpdateHandler: () => void;
}) {
  const [show, setShow] = React.useState(true);
  const { releaseDownloadURL, fetchingRelease, releaseFetchFailed, skipUpdateHandler } = props;
  const { t } = useTranslation('frequent');

  if (fetchingRelease) {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        autoHideDuration={5000}
        message={t('release|Fetching release information…')}
        ContentProps={{
          'aria-describedby': 'updatePopup',
        }}
        open={fetchingRelease}
        action={
          <React.Fragment>
            <Button
              color="primary"
              onClick={() => {
                skipUpdateHandler();
              }}
            >
              {t('frequent|Skip')}
            </Button>
          </React.Fragment>
        }
      />
    );
  }

  if (releaseFetchFailed) {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={releaseFetchFailed}
        message={t('release|Failed to fetch release information')}
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
      open={show}
      autoHideDuration={100000}
      ContentProps={{
        'aria-describedby': 'updatePopup',
      }}
      message={t('release|An update is available')}
      action={
        <React.Fragment>
          <Button color="secondary" onClick={() => window.open(releaseDownloadURL)}>
            {t('frequent|More')}
          </Button>
          <Button
            color="inherit"
            onClick={() => {
              localStorage.setItem('disable_update_check', 'true');
              setShow(false);
            }}
          >
            {t('Do not notify again')}
          </Button>
          <Button color="primary" onClick={() => setShow(false)}>
            {t('frequent|Close')}
          </Button>
        </React.Fragment>
      }
    />
  );
}

UpdatePopup.defaultProps = {
  open: true,
};

export default UpdatePopup;
