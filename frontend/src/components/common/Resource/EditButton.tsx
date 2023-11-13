import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { KubeObject, KubeObjectInterface } from '../../../lib/k8s/cluster';
import { CallbackActionOptions, clusterAction } from '../../../redux/clusterActionSlice';
import ActionButton from '../ActionButton';
import AuthVisible from './AuthVisible';
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
  const [isReadOnly, setIsReadOnly] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const location = useLocation();
  const { t } = useTranslation(['translation', 'resource']);

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
        startMessage: t('translation|Applying changes to {{ itemName }}…', { itemName }),
        cancelledMessage: t('translation|Cancelled changes to {{ itemName }}.', { itemName }),
        successMessage: t('translation|Applied changes to {{ itemName }}.', { itemName }),
        errorMessage: t('translation|Failed to apply changes to {{ itemName }}.', { itemName }),
        cancelUrl,
        errorUrl: cancelUrl,
        ...options,
      })
    );
  }

  if (!item) {
    return null;
  }

  if (isReadOnly) {
    return <ViewButton item={item} />;
  }

  return (
    <AuthVisible
      item={item}
      authVerb="update"
      onError={(err: Error) => {
        console.error(`Error while getting authorization for edit button in ${item}:`, err);
        setIsReadOnly(true);
      }}
      onAuthResult={({ allowed }) => {
        setIsReadOnly(!allowed);
      }}
    >
      <ActionButton
        description={t('translation|Edit')}
        onClick={() => setOpenDialog(true)}
        icon="mdi:pencil"
      />
      {openDialog && (
        <EditorDialog
          item={item.jsonData}
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSave={handleSave}
          errorMessage={errorMessage}
          onEditorChanged={() => setErrorMessage('')}
        />
      )}
    </AuthVisible>
  );
}
