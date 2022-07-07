import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { apply } from '../../../lib/k8s/apiProxy';
import { KubeObjectInterface } from '../../../lib/k8s/cluster';
import { clusterAction } from '../../../redux/actions/actions';
import ActionButton from '../ActionButton';
import EditorDialog from './EditorDialog';

export default function CreateButton() {
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const location = useLocation();
  const { t } = useTranslation(['resource', 'frequent']);

  const applyFunc = async (newItem: KubeObjectInterface) => {
    try {
      await apply(newItem);
    } catch (err) {
      let msg = t('Something went wrong…');
      if (err instanceof Error) {
        msg = err.message;
      }
      setErrorMessage(msg);
      setOpenDialog(true);
      throw err;
    }
  };

  function handleSave(newItemDef: KubeObjectInterface) {
    const cancelUrl = location.pathname;

    if (!newItemDef.metadata?.name) {
      setErrorMessage(t('Please set a name to the resource!'));
      return;
    }

    if (!newItemDef.kind) {
      setErrorMessage(t('Please set a kind to the resource!'));
      return;
    }

    const newItemName = newItemDef.metadata.name;

    setOpenDialog(false);
    dispatch(
      clusterAction(() => applyFunc(newItemDef), {
        startMessage: t('Applying {{ newItemName }}…', { newItemName }),
        cancelledMessage: t('Cancelled applying {{ newItemName }}.', { newItemName }),
        successMessage: t('Applied {{ newItemName }}.', { newItemName }),
        errorMessage: t('Failed to apply {{ newItemName }}.', { newItemName }),
        cancelUrl,
      })
    );
  }

  return (
    <React.Fragment>
      <ActionButton
        description={t('frequent|Create / Apply')}
        onClick={() => setOpenDialog(true)}
        color="#adadad"
        icon="mdi:plus-circle"
        width="48"
      />
      <EditorDialog
        item={{}}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        saveLabel={t('frequent|Apply')}
        errorMessage={errorMessage}
        onEditorChanged={() => setErrorMessage('')}
        title={t('frequent|Create / Apply')}
      />
    </React.Fragment>
  );
}
