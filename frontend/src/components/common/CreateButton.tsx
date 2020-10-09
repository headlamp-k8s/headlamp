import plusCircle from '@iconify/icons-mdi/plus-circle';
import { Icon } from '@iconify/react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { apply } from '../../lib/k8s/apiProxy';
import { KubeObjectInterface } from '../../lib/k8s/cluster';
import { clusterAction } from '../../redux/actions/actions';
import EditorDialog from './EditorDialog';

export default function CreateButton() {
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const location = useLocation();

  const applyFunc = async (newItem: KubeObjectInterface) => {
    try {
      await apply(newItem);
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong…');
      setOpenDialog(true);
      throw err;
    }
  };

  function handleSave(newItemDef: KubeObjectInterface) {
    const cancelUrl = location.pathname;

    if (!newItemDef.metadata?.name) {
      setErrorMessage('Please set a name to the resource!');
      return;
    }

    if (!newItemDef.kind) {
      setErrorMessage('Please set a kind to the resource!');
      return;
    }

    setOpenDialog(false);
    dispatch(clusterAction(() => applyFunc(newItemDef),
      {
        startMessage: `Applying ${newItemDef.metadata.name}…`,
        cancelledMessage: `Cancelled applying ${newItemDef.metadata.name}.`,
        successMessage: `Applied ${newItemDef.metadata.name}.`,
        errorMessage: `Failed to apply ${newItemDef.metadata.name}.`,
        cancelUrl,
      }
    ));
  }

  return (
    <React.Fragment>
      <Tooltip title="Create / Apply">
        <IconButton
          aria-label="apply"
          onClick={() => setOpenDialog(true)}
        >
          <Icon color="#adadad" icon={plusCircle} width="48" />
        </IconButton>
      </Tooltip>
      <EditorDialog
        item={{}}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        saveLabel="Apply"
        errorMessage={errorMessage}
        onEditorChanged={() => setErrorMessage('')}
        title="Create / Apply"
      />
    </React.Fragment>
  );
}
