import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { KubeObject, KubeObjectInterface } from '../../../lib/k8s/cluster';
import { CallbackActionOptions, clusterAction } from '../../../redux/actions/actions';
import ActionButton from '../ActionButton';
import EditorDialog from './EditorDialog';
import ViewButton from './ViewButton';

interface EditButtonProps {
  item: KubeObject;
  options?: CallbackActionOptions;
}

export default function EditButton(props: EditButtonProps) {
  const dispatch = useDispatch();
  const { item, options = {} } = props;
  const [openDialog, setOpenDialog] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const location = useLocation();
  const { t } = useTranslation(['frequent', 'resource']);

  function makeErrorMessage(err: any) {
    const status: number = err.status;
    switch (status) {
      case 408:
        return 'Conflicts when trying to perform operation (code 408).';
      default:
        return `Failed to perform operation: code ${status}`;
    }
  }

  async function updateFunc(newItem: KubeObjectInterface) {
    try {
      await item.update(newItem);
    } catch (err) {
      setErrorMessage(makeErrorMessage(err));
      setOpenDialog(true);
      throw err;
    }
  }

  const applyFunc = React.useCallback(updateFunc, [item]);

  function handleSave(items: KubeObjectInterface[]) {
    const newItemDef = Array.isArray(items) ? items[0] : items;
    const cancelUrl = location.pathname;
    const itemName = item.metadata.name;

    setOpenDialog(false);
    dispatch(
      clusterAction(() => applyFunc(newItemDef), {
        startMessage: t('Applying changes to {{ itemName }}…', { itemName }),
        cancelledMessage: t('Cancelled changes to {{ itemName }}.', { itemName }),
        successMessage: t('Applied changes to {{ itemName }}.', { itemName }),
        errorMessage: t('Failed to apply changes to {{ itemName }}.', { itemName }),
        cancelUrl,
        errorUrl: cancelUrl,
        ...options,
      })
    );
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

  if (!visible) {
    return <ViewButton item={item} />;
  }

  return (
    <>
      <ActionButton
        description={t('frequent|Edit')}
        onClick={() => setOpenDialog(true)}
        icon="mdi:pencil"
      />
      <EditorDialog
        item={item.jsonData}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        errorMessage={errorMessage}
        onEditorChanged={() => setErrorMessage('')}
      />
    </>
  );
}
