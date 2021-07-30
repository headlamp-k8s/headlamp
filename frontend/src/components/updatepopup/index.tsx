import { Button, Snackbar } from '@material-ui/core';
import React from 'react';

function UpdatePopup() {
  const [show, setShow] = React.useState(false);
  const [updateDownloadURL, setUpdateDownloadURL] = React.useState<string | undefined>();
  const { desktopApi } = window;
  React.useEffect(() => {
    desktopApi &&
      desktopApi.receive('update_available', (data: { downloadURL: string }) => {
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
      message={`There is an available update`}
      action={
        <React.Fragment>
          <Button color="secondary" onClick={() => window.open(updateDownloadURL)}>
            More
          </Button>
          <Button
            color="inherit"
            onClick={() => {
              desktopApi.send('disable_update_checking');
              setShow(false);
            }}
          >
            Do not notify again
          </Button>
          <Button color="primary" onClick={() => setShow(false)}>
            Close
          </Button>
        </React.Fragment>
      }
    />
  );
}

export default UpdatePopup;
