import { Button, Snackbar } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

function UpdatePopup(props: { releaseDownloadURL: string }) {
  const [show, setShow] = React.useState(true);
  const { releaseDownloadURL } = props;
  const { t } = useTranslation('frequent');

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

export default UpdatePopup;
