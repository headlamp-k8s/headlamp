import { Button, Snackbar } from '@material-ui/core';
import React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface UpdatePopupProps {
  releaseDownloadURL: string;
  open: boolean;
}

function UpdatePopup(props: UpdatePopupProps) {
  const { releaseDownloadURL, open } = props;
  const { t } = useTranslation('frequent');
  const [show, setShow] = useState(open);

  useEffect(() => {
    setShow(open);
  }, [open]);

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
