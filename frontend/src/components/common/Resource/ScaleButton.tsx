import { Icon } from '@iconify/react';
import { DialogContentText } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MuiInput from '@mui/material/Input';
import { styled, useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { KubeObject } from '../../../lib/k8s/cluster';
import { CallbackActionOptions, clusterAction } from '../../../redux/clusterActionSlice';
import { LightTooltip } from '../Tooltip';
import AuthVisible from './AuthVisible';

interface ScaleButtonProps {
  item: KubeObject;
  options?: CallbackActionOptions;
}

export default function ScaleButton(props: ScaleButtonProps) {
  const dispatch = useDispatch();
  const { item, options = {} } = props;
  const [openDialog, setOpenDialog] = React.useState(false);
  const location = useLocation();
  const { t } = useTranslation();

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

  if (!item || !['Deployment', 'StatefulSet', 'ReplicaSet'].includes(item.kind)) {
    return null;
  }

  return (
    <AuthVisible
      item={item}
      authVerb="update"
      onError={(err: Error) => {
        console.error(`Error while getting authorization for scaling button in ${item}:`, err);
      }}
    >
      <Tooltip title={t('translation|Scale') as string}>
        <IconButton
          aria-label={t('translation|scale')}
          onClick={() => setOpenDialog(true)}
          size="medium"
        >
          <Icon icon="mdi:content-copy" />
        </IconButton>
      </Tooltip>
      <ScaleDialog resource={item} open={openDialog} onClose={handleClose} onSave={handleSave} />
    </AuthVisible>
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
  const { t } = useTranslation(['translation']);
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
              {t('translation|Current number of replicas: {{ numReplicas }}', {
                numReplicas:
                  currentNumReplicas === -1 ? t('translation|Unknown') : currentNumReplicas,
              })}
            </DialogContentText>
          </Grid>
          <Grid item container alignItems="center" spacing={1}>
            <Grid item sm="auto" xs={12}>
              <DialogContentText
                id={desiredNumReplicasLabel}
                className={classes.desiredReplicasText}
              >
                {t('translation|Desired number of replicas:')}
              </DialogContentText>
            </Grid>
            <Grid item spacing={2} sm="auto" className={classes.replicasSwitcher}>
              <Fab
                size="small"
                color="primary"
                onClick={() => setNumReplicas(numReplicas => numReplicas - 1)}
                aria-label={t('translation|Decrement')}
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
                aria-label={t('translation|Increment')}
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
          {t('translation|Cancel')}
        </Button>
        <Button onClick={() => onSave(numReplicas)} color="primary">
          {t('translation|Apply')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
