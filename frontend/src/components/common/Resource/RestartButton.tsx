import _ from 'lodash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { apply } from '../../../lib/k8s/apiProxy';
import DaemonSet from '../../../lib/k8s/daemonSet';
import Deployment from '../../../lib/k8s/deployment';
import { KubeObject } from '../../../lib/k8s/KubeObject';
import StatefulSet from '../../../lib/k8s/statefulSet';
import { clusterAction } from '../../../redux/clusterActionSlice';
import {
  EventStatus,
  HeadlampEventType,
  useEventCallback,
} from '../../../redux/headlampEventSlice';
import { AppDispatch } from '../../../redux/stores/store';
import ActionButton, { ButtonStyle } from '../ActionButton';
import ConfirmDialog from '../ConfirmDialog';
import AuthVisible from './AuthVisible';

export type RestartableResource = Deployment | StatefulSet | DaemonSet;

export function isRestartableResource(item: KubeObject): item is RestartableResource {
  return item instanceof Deployment || item instanceof StatefulSet || item instanceof DaemonSet;
}

interface RestartButtonProps {
  item: RestartableResource;
  buttonStyle?: ButtonStyle;
  afterConfirm?: () => void;
}

export function RestartButton(props: RestartButtonProps) {
  const dispatch: AppDispatch = useDispatch();

  const { item, buttonStyle, afterConfirm } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const location = useLocation();
  const { t } = useTranslation(['translation']);
  const dispatchRestartEvent = useEventCallback(HeadlampEventType.RESTART_RESOURCE);

  function applyFunc() {
    try {
      const clonedItem = _.cloneDeep(item);
      clonedItem.spec.template.metadata.annotations = {
        ...clonedItem.spec.template.metadata.annotations,
        'kubectl.kubernetes.io/restartedAt': new Date().toISOString(),
      };
      apply(clonedItem.jsonData);
    } catch (err) {
      console.error('Error while restarting resource:', err);
    }
  }

  function handleSave() {
    const itemName = item.metadata.name;

    dispatch(
      clusterAction(() => applyFunc(), {
        startMessage: t('Restarting {{ itemName }}…', { itemName }),
        cancelledMessage: t('Cancelled restarting {{ itemName }}.', { itemName }),
        successMessage: t('Restarted {{ itemName }}.', { itemName }),
        errorMessage: t('Failed to restart {{ itemName }}.', { itemName }),
        cancelUrl: location.pathname,
        startUrl: item.getListLink(),
        errorUrl: item.getListLink(),
      })
    );
  }

  return (
    <AuthVisible
      item={item}
      authVerb="update"
      onError={(err: Error) => {
        console.error(`Error while getting authorization for restart button in ${item}:`, err);
      }}
    >
      <ActionButton
        description={t('translation|Restart')}
        buttonStyle={buttonStyle}
        onClick={() => {
          setOpenDialog(true);
        }}
        icon="mdi:restart"
      />
      <ConfirmDialog
        open={openDialog}
        title={t('translation|Restart')}
        description={t('translation|Are you sure you want to restart {{ itemName }}?', {
          itemName: item.metadata.name,
        })}
        handleClose={() => setOpenDialog(false)}
        onConfirm={() => {
          handleSave();
          dispatchRestartEvent({
            resource: item,
            status: EventStatus.CONFIRMED,
          });
          if (afterConfirm) {
            afterConfirm();
          }
        }}
      />
    </AuthVisible>
  );
}
