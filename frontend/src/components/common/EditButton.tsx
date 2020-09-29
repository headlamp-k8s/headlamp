import pencilIcon from '@iconify/icons-mdi/pencil';
import { Icon } from '@iconify/react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { KubeObject } from '../../lib/k8s/cluster';
import { KubeServiceAccount } from '../../lib/k8s/serviceAccount';
import { CallbackActionOptions, clusterAction } from '../../redux/actions/actions';
import EditorDialog from './EditorDialog';

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

  function makeErrorMessage(err: any) {
    const status: number = err.status;
    switch (status) {
      case 408:
        return 'Conflicts when trying to perform operation (code 408).';
      default:
        return `Failed to perform operation: code ${status}`;
    }
  }

  async function updateFunc(newItem: KubeServiceAccount) {
    try {
      await item.update(newItem);
    } catch (err) {
      setErrorMessage(makeErrorMessage(err));
      setOpenDialog(true);
      throw err;
    }
  }

  const applyFunc = React.useCallback(updateFunc, [item]);

  function handleSave(newItemDef: KubeServiceAccount) {
    const cancelUrl = location.pathname;

    setOpenDialog(false);
    dispatch(clusterAction(() => applyFunc(newItemDef),
      {
        startMessage: `Applying changes to ${item.metadata.name}…`,
        cancelledMessage: `Cancelled changes to ${item.metadata.name}.`,
        successMessage: `Applied changes to ${item.metadata.name}.`,
        errorMessage: `Failed to apply changes to ${item.metadata.name}.`,
        cancelUrl,
        errorUrl: cancelUrl,
        ...options
      }
    ));
  }

  React.useEffect(() => {
    if (item) {
      item.getAuthorization('update').then(
        (result: any) => {
          if (result.status.allowed) {
            setVisible(true);
          }
        }
      );
    }
  },
  [item]);

  if (!visible) {
    return null;
  }

  return (
    <React.Fragment>
      <Tooltip title="Edit">
        <IconButton
          aria-label="edit"
          onClick={() => setOpenDialog(true)}
        >
          <Icon icon={pencilIcon} />
        </IconButton>
      </Tooltip>
      <EditorDialog
        item={item.jsonData}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        errorMessage={errorMessage}
        onEditorChanged={() => setErrorMessage('')}
      />
    </React.Fragment>
  );
}
