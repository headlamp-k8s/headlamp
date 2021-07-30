import { Button, Snackbar } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

function UpdatePopup() {
  const [show, setShow] = React.useState(false);
  const [updateDownloadURL, setUpdateDownloadURL] = React.useState<string | undefined>();
  const { t } = useTranslation('frequent');
  const { desktopApi } = window;
  React.useEffect(() => {
    desktopApi &&
      desktopApi.receive('updateAvailable', (data: { downloadURL: string }) => {
        setShow(true);
        setUpdateDownloadURL(data.downloadURL);
      });
  }, []);

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
      message={t('An update is available')}
      action={
        <React.Fragment>
          <Button color="secondary" onClick={() => window.open(updateDownloadURL)}>
            {t('frequent|More')}
          </Button>
          <Button
            color="inherit"
            onClick={() => {
              desktopApi.send('disableUpdateChecking');
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

export default UpdatePopup;
