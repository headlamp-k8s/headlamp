import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { apply } from '../../../lib/k8s/apiProxy';
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
    <p>
      {t('Are you sure you want to restart the following items?')}
      <ul>
        {props.items.map(item => (
          <li key={item.metadata.uid}>{item.metadata.name}</li>
        ))}
      </ul>
    </p>
  );
}

export default function RestartMultipleButton(props: RestartMultipleButtonProps) {
  const dispatch: AppDispatch = useDispatch();
  const { items, buttonStyle, afterConfirm } = props;
  const [openDialog, setOpenDialog] = React.useState(false);
  const { t } = useTranslation(['translation']);
  const location = useLocation();
  const dispatchRestartEvent = useEventCallback(HeadlampEventType.RESTART_RESOURCES);

  function applyFunc() {
    return Promise.all(
      items.map(item => {
        try {
          const clonedItem = _.cloneDeep(item);
          clonedItem.spec.template.metadata.annotations = {
            ...clonedItem.spec.template.metadata.annotations,
            'kubectl.kubernetes.io/restartedAt': new Date().toISOString(),
          };
          return apply(clonedItem.jsonData);
        } catch (err) {
          console.error('Error while restarting resource:', err);
          return Promise.reject(err);
        }
      })
    );
  }

  const handleSave = () => {
    const itemsLength = items.length;

    dispatch(
      clusterAction(() => applyFunc(), {
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
          handleSave();
          dispatchRestartEvent({
            resources: items,
            status: EventStatus.CONFIRMED,
          });
          if (afterConfirm) {
            afterConfirm();
          }
        }}
      />
    </>
  );
}
