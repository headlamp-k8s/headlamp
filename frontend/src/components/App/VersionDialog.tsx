import { DialogContent } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import helpers from '../../helpers';
import { setVersionDialogOpen } from '../../redux/actions/actions';
import { useTypedSelector } from '../../redux/reducers/reducers';
import { Dialog, NameValueTable } from '../common';

export default function VersionDialog() {
  const open = useTypedSelector(state => state.ui.isVersionDialogOpen);
  const dispatch = useDispatch();
  const { t } = useTranslation('frequent');
  const { VERSION, GIT_VERSION } = helpers.getVersion();

  return (
    <Dialog
      maxWidth="sm"
      open={open}
      onClose={() => dispatch(setVersionDialogOpen(false))}
      title={helpers.getProductName()}
      // We want the dialog to show on top of the cluster chooser one if needed
      style={{ zIndex: 1900 }}
    >
      <DialogContent>
        <NameValueTable
          rows={[
            {
              name: t('Version'),
              value: VERSION,
            },
            {
              name: t('Git Commit'),
              value: GIT_VERSION,
            },
          ]}
        />
      </DialogContent>
    </Dialog>
  );
}
