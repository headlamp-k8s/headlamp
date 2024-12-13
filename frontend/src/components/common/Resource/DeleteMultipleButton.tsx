import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { KubeObject } from '../../../lib/k8s/KubeObject';
import { CallbackActionOptions, clusterAction } from '../../../redux/clusterActionSlice';
import {
  EventStatus,
  HeadlampEventType,
  useEventCallback,
} from '../../../redux/headlampEventSlice';
import { AppDispatch } from '../../../redux/stores/store';
import ActionButton, { ButtonStyle } from '../ActionButton';
import { ConfirmDialog } from '../Dialog';

interface DeleteMultipleButtonProps {
  items?: KubeObject[];
  options?: CallbackActionOptions;
  buttonStyle?: ButtonStyle;
  afterConfirm?: () => void;
}

interface DeleteMultipleButtonDescriptionProps {
  items?: KubeObject[];
}

function DeleteMultipleButtonDescription(props: DeleteMultipleButtonDescriptionProps) {
  const { t } = useTranslation(['translation']);
  return (
    <p>
      {t('Are you sure you want to delete the following items?')}
      <ul>
        {props.items?.map(item => (
          <li key={item.metadata.uid}>{item.metadata.name}</li>
        ))}
      </ul>
    </p>
  );
}

export default function DeleteMultipleButton(props: DeleteMultipleButtonProps) {
  const dispatch: AppDispatch = useDispatch();
  const { items, options, afterConfirm, buttonStyle } = props;
  const [openAlert, setOpenAlert] = React.useState(false);
  const { t } = useTranslation(['translation']);
  const dispatchDeleteEvent = useEventCallback(HeadlampEventType.DELETE_RESOURCES);

  const deleteFunc = React.useCallback(
    (items: KubeObject[]) => {
      if (!items || items.length === 0) {
        return;
      }
      const clonedItems = _.cloneDeep(items);
      const itemsLength = clonedItems.length;

      dispatch(
        clusterAction(
          async () => {
            await Promise.all(items.map(item => item.delete()));
          },
          {
            startMessage: t('Deleting {{ itemsLength }} items…', { itemsLength }),
            cancelledMessage: t('Cancelled deletion of {{ itemsLength }} items.', { itemsLength }),
            successMessage: t('Deleted {{ itemsLength }} items.', { itemsLength }),
            errorMessage: t('Error deleting {{ itemsLength }} items.', { itemsLength }),
            cancelUrl: location.pathname,
            startUrl: location.pathname,
            errorUrl: location.pathname,
            ...options,
          }
        )
      );
    },
    [options]
  );

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <>
      <ActionButton
        description={t('translation|Delete items')}
        buttonStyle={buttonStyle}
        onClick={() => {
          setOpenAlert(true);
        }}
        icon="mdi:delete"
      />
      <ConfirmDialog
        open={openAlert}
        title={t('translation|Delete items')}
        description={<DeleteMultipleButtonDescription items={items} />}
        handleClose={() => setOpenAlert(false)}
        onConfirm={() => {
          deleteFunc(items);
          dispatchDeleteEvent({
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
