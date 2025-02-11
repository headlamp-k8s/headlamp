import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { clusterAction } from '../../../redux/clusterActionSlice';
import {
  EventStatus,
  HeadlampEventType,
  useEventCallback,
} from '../../../redux/headlampEventSlice';
import { AppDispatch } from '../../../redux/stores/store';
import ActionButton, { ButtonStyle } from '../ActionButton';
import ConfirmDialog from '../ConfirmDialog';
import { RestartableResource } from './RestartButton';

interface RestartMultipleButtonProps {
  items: RestartableResource[];
  buttonStyle?: ButtonStyle;
  afterConfirm?: () => void;
}

function RestartMultipleButtonDescription(props: Pick<RestartMultipleButtonProps, 'items'>) {
  const { t } = useTranslation(['translation']);
  return (
    <>
      {t('Are you sure you want to restart the following items?')}
      <ul>
        {props.items.map(item => (
          <li key={item.metadata.uid}>{item.metadata.name}</li>
        ))}
      </ul>
    </>
  );
}

export default function RestartMultipleButton(props: RestartMultipleButtonProps) {
  const dispatch: AppDispatch = useDispatch();
  const { items, buttonStyle, afterConfirm } = props;
  const [openDialog, setOpenDialog] = React.useState(false);
  const { t } = useTranslation(['translation']);
  const location = useLocation();
  const dispatchRestartEvent = useEventCallback(HeadlampEventType.RESTART_RESOURCES);

  async function restartResources() {
    return Promise.all(
      items.map(item => {
        const patchData = {
          spec: {
            template: {
              metadata: {
                annotations: {
                  'kubectl.kubernetes.io/restartedAt': new Date().toISOString(),
                },
              },
            },
          },
        };
        return item.patch(patchData);
      })
    );
  }

  const handleRestart = () => {
    const itemsLength = items.length;

    dispatch(
      clusterAction(() => restartResources(), {
        startMessage: t('Restarting {{ itemsLength }} items…', { itemsLength }),
        cancelledMessage: t('Cancelled restarting {{ itemsLength }} items.', { itemsLength }),
        successMessage: t('Restarted {{ itemsLength }} items.', { itemsLength }),
        errorMessage: t('Failed to restart {{ itemsLength }} items.', { itemsLength }),
        cancelUrl: location.pathname,
        startUrl: location.pathname,
        errorUrl: location.pathname,
      })
    );
  };

  return (
    <>
      <ActionButton
        description={t('translation|Restart items')}
        buttonStyle={buttonStyle}
        onClick={() => {
          setOpenDialog(true);
        }}
        icon="mdi:restart"
      />
      <ConfirmDialog
        open={openDialog}
        title={t('translation|Restart items')}
        description={<RestartMultipleButtonDescription items={items} />}
        handleClose={() => setOpenDialog(false)}
        onConfirm={() => {
          handleRestart();
          dispatchRestartEvent({
            resources: items,
            status: EventStatus.CONFIRMED,
          });
          if (afterConfirm) {
            afterConfirm();
          }
        }}
        cancelLabel={t('Cancel')}
        confirmLabel={t('Restart')}
      />
    </>
  );
}
