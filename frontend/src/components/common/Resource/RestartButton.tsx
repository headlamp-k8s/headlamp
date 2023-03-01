import { Icon } from '@iconify/react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import _ from 'lodash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { apply } from '../../../lib/k8s/apiProxy';
import { KubeObject } from '../../../lib/k8s/cluster';
import { clusterAction } from '../../../redux/actions/actions';
import AuthVisible from './AuthVisible';

interface RestartButtonProps {
  item: KubeObject;
}

export function RestartButton(props: RestartButtonProps) {
  const { item } = props;
  const { t } = useTranslation('frequent');
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch = useDispatch();

  function applyFunc() {
    try {
      const clonedItem = _.cloneDeep(item);
      clonedItem.spec.template.metadata.annotations = {
        ...clonedItem.metadata.annotations,
        'kubectl.kubernetes.io/restartedAt': new Date().toISOString(),
      };
      apply(clonedItem.jsonData);
    } catch (err) {
      console.error('Error while restarting resource:', err);
    }
  }

  function handleClose() {
    setOpenDialog(false);
  }

  function handleSave() {
    const cancelUrl = location.pathname;
    const itemName = item.metadata.name;

    setOpenDialog(false);

    // setOpenDialog(false);
    dispatch(
      clusterAction(() => applyFunc(), {
        startMessage: t('Restarting {{ itemName }}…', { itemName }),
        cancelledMessage: t('Cancelled restarting {{ itemName }}.', { itemName }),
        successMessage: t('Restarted {{ itemName }}.', { itemName }),
        errorMessage: t('Failed to restart {{ itemName }}.', { itemName }),
        cancelUrl,
        errorUrl: cancelUrl,
      })
    );
  }

  if (!['Deployment', 'StatefulSet', 'DaemonSet'].includes(item.kind)) {
    return null;
  }

  return (
    <AuthVisible
      item={item}
      authVerb="update"
      onError={(err: Error) => {
        console.error(`Error while getting authorization for restart button in ${item}:`, err);
      }}
    >
      <Tooltip title={t('frequent|Restart') as string}>
        <IconButton aria-label={t('frequent|restart')} onClick={() => setOpenDialog(true)}>
          <Icon icon="mdi:restart" />
        </IconButton>
      </Tooltip>
      <RestartDialog resource={item} open={openDialog} onClose={handleClose} onSave={handleSave} />
    </AuthVisible>
  );
}

interface RestartDialogProps {
  resource: KubeObject;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

function RestartDialog(props: RestartDialogProps) {
  const { resource, open, onClose, onSave } = props;
  const { t } = useTranslation('frequent');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle id="form-dialog-title">{t('frequent|Restart')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('frequent|Are you sure you want to restart {{ name }}?', {
            name: resource.metadata.name,
          })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t('frequent|Cancel')}
        </Button>
        <Button onClick={onSave} color="primary">
          {t('frequent|Restart')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
