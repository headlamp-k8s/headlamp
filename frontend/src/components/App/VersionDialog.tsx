import { DialogContent } from '@material-ui/core';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useTranslation } from 'react-i18next';
import { Dialog, NameValueTable } from '../common';

export default function VersionDialog() {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();
  useHotkeys('alt+shift+v', () => setOpen(true));

  return (
    <Dialog open={open} onClose={() => setOpen(false)} title={t('Version')}>
      <DialogContent>
        <NameValueTable
          rows={[
            {
              name: 'Version',
              value: process.env.REACT_APP_VERSION,
            },
            {
              name: 'Build Date',
              value: process.env.REACT_APP_BUILD_DATE,
            },
            {
              name: 'Git Commit',
              value: process.env.REACT_APP_GIT_COMMIT,
            },
          ]}
        />
      </DialogContent>
    </Dialog>
  );
}
