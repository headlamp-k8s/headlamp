import { DialogContent, Link } from '@material-ui/core';
import { useHotkeys } from 'react-hotkeys-hook';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setVersionDialogOpen } from '../../redux/actions/actions';
import { useTypedSelector } from '../../redux/reducers/reducers';
import { Dialog, NameValueTable } from '../common';

export default function VersionDialog() {
  const open = useTypedSelector(state => state.ui.isVersionDialogOpen);
  const dispatch = useDispatch();
  const { t } = useTranslation('frequent');
  useHotkeys('alt+shift+v', () => {
    dispatch(setVersionDialogOpen(true));
  });

  return (
    <Dialog
      maxWidth="sm"
      open={open}
      onClose={() => dispatch(setVersionDialogOpen(false))}
      title={window.config.HEADLAMP_PRODUCT_NAME}
    >
      <DialogContent>
        <NameValueTable
          rows={[
            {
              name: t('Version'),
              value: window.config.HEADLAMP_VERSION,
            },
            {
              name: t('Git Commit'),
              value: window.config.HEADLAMP_GIT_VERSION,
            },
          ]}
        />
      </DialogContent>
    </Dialog>
  );
}

export function HeadlampVersionLink() {
  const dispatch = useDispatch();
  return (
    <Link onClick={() => dispatch(setVersionDialogOpen(true))}>
      {window.config.HEADLAMP_PRODUCT_NAME} {window.config.HEADLAMP_VERSION}
    </Link>
  );
}
