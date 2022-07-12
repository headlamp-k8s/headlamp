import { Icon } from '@iconify/react';
import { DialogContentText } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MuiInput from '@material-ui/core/Input';
import { makeStyles, styled, useTheme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { KubeObject } from '../../../lib/k8s/cluster';
import { CallbackActionOptions, clusterAction } from '../../../redux/actions/actions';
import { LightTooltip } from '../Tooltip';

interface ScaleButtonProps {
  item: KubeObject;
  options?: CallbackActionOptions;
}

export default function ScaleButton(props: ScaleButtonProps) {
  const dispatch = useDispatch();
  const { item, options = {} } = props;
  const [openDialog, setOpenDialog] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const location = useLocation();
  const { t } = useTranslation('resource');

  async function updateFunc(numReplicas: number) {
    try {
      await item.scale(numReplicas);
    } catch (err) {
      throw err;
    }
  }

  const applyFunc = React.useCallback(updateFunc, [item]);

  function handleSave(numReplicas: number) {
    const cancelUrl = location.pathname;
    const itemName = item.metadata.name;

    setOpenDialog(false);

    // setOpenDialog(false);
    dispatch(
      clusterAction(() => applyFunc(numReplicas), {
        startMessage: t('Scaling {{ itemName }}…', { itemName }),
        cancelledMessage: t('Cancelled scaling {{ itemName }}.', { itemName }),
        successMessage: t('Scaled {{ itemName }}.', { itemName }),
        errorMessage: t('Failed to scale {{ itemName }}.', { itemName }),
        cancelUrl,
        errorUrl: cancelUrl,
        ...options,
      })
    );
  }

  function handleClose() {
    setOpenDialog(false);
  }

  React.useEffect(() => {
    if (item) {
      item
        .getAuthorization('update')
        .then((result: any) => {
          if (result.status.allowed) {
            setVisible(true);
          }
        })
        .catch((err: Error) => {
          console.error(`Error while getting authorization for edit button in ${item}:`, err);
          setVisible(false);
        });
    }
  }, [item]);

  if (!visible || !['Deployment', 'StatefulSet', 'ReplicaSet'].includes(item.kind)) {
    return null;
  }

  return (
    <>
      <Tooltip title={t('frequent|Scale') as string}>
        <IconButton aria-label={t('frequent|scale')} onClick={() => setOpenDialog(true)}>
          <Icon icon="mdi:content-copy" />
        </IconButton>
      </Tooltip>
      <ScaleDialog resource={item} open={openDialog} onClose={handleClose} onSave={handleSave} />
    </>
  );
}

interface ScaleDialogProps extends DialogProps {
  resource: KubeObject;
  onSave: (numReplicas: number) => void;
  onClose: () => void;
  errorMessage?: string;
}

const Input = styled(MuiInput)({
  '& input[type=number]': {
    MozAppearance: 'textfield',
    textAlign: 'center',
  },
  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
    display: 'none',
  },
  width: '80px',
});

const useScaleDialogStyle = makeStyles(() => ({
  dialogContent: {
    paddingBottom: '30px', // Prevent the content from overflowing
  },
  replicasNumberInput: {
    marginLeft: '6px',
    marginRight: '6px',
  },
  replicasSwitcher: {
    padding: '6px',
    textAlign: 'left',
  },
  desiredReplicasText: {
    minWidth: '250px',
  },
}));

function ScaleDialog(props: ScaleDialogProps) {
  const { open, resource, onClose, onSave } = props;
  const [numReplicas, setNumReplicas] = React.useState<number>(getNumReplicas());
  const { t } = useTranslation(['frequent', 'resource']);
  const classes = useScaleDialogStyle();
  const theme = useTheme();
  const desiredNumReplicasLabel = 'desired-number-replicas-label';
  const numReplicasForWarning = 100;

  function getNumReplicas() {
    if (!resource?.spec) {
      return -1;
    }

    return parseInt(resource.spec.replicas);
  }

  const currentNumReplicas = getNumReplicas();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('Scale Replicas')}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <DialogContentText>
              {t('resource|Current number of replicas: {{ numReplicas }}', {
                numReplicas: currentNumReplicas === -1 ? t('frequent|Unknown') : currentNumReplicas,
              })}
            </DialogContentText>
          </Grid>
          <Grid item container alignItems="center" spacing={1}>
            <Grid item sm="auto" xs={12}>
              <DialogContentText
                id={desiredNumReplicasLabel}
                className={classes.desiredReplicasText}
              >
                {t('resource|Desired number of replicas:')}
              </DialogContentText>
            </Grid>
            <Grid item spacing={2} sm="auto" className={classes.replicasSwitcher}>
              <Fab
                size="small"
                color="primary"
                onClick={() => setNumReplicas(numReplicas => numReplicas - 1)}
                aria-label={t('frequent|Decrement')}
              >
                <Icon icon="mdi:minus" width="22px" />
              </Fab>
              <Input
                type="number"
                value={numReplicas}
                className={classes.replicasNumberInput}
                onChange={e => setNumReplicas(Number(e.target.value))}
                aria-labelledby={desiredNumReplicasLabel}
                inputProps={{
                  min: 0,
                  step: 1,
                }}
              />
              <Fab
                size="small"
                color="primary"
                onClick={() => setNumReplicas(numReplicas => numReplicas + 1)}
                aria-label={t('frequent|Increment')}
              >
                <Icon icon="mdi:plus" width="22px" />
              </Fab>
            </Grid>
            <Grid item xs="auto">
              {numReplicas >= numReplicasForWarning && (
                <LightTooltip
                  title={t(
                    "A large number of replicas may negatively impact the cluster's performance"
                  )}
                >
                  <Icon icon="mdi:warning" width="28px" color={theme.palette.warning.main} />
                </LightTooltip>
              )}
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t('frequent|Cancel')}
        </Button>
        <Button onClick={() => onSave(numReplicas)} color="primary">
          {t('frequent|Apply')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
