import pencilIcon from '@iconify/icons-mdi/pencil';
import { Icon } from '@iconify/react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from "react-router-dom";
import { clusterAction } from '../../redux/actions/actions';
import EditorDialog from './EditorDialog';

export default function EditButton(props) {
  const dispatch = useDispatch();
  const { item, options, applyCallback, errorCallback } = props;
  const [openDialog, setOpenDialog] = React.useState(false);
  const location = useLocation();

  function handleSave(newItemDef) {
    const cancelUrl = location.pathname;

    setOpenDialog(false);

    dispatch(clusterAction(() => applyCallback(newItemDef),
      {
        startMessage: `Applying changes to ${item.metadata.name}…`,
        cancelledMessage: `Cancelled changes to ${item.metadata.name}.`,
        successMessage: `Applied changes to ${item.metadata.name}.`,
        cancelUrl,
        ...options
      }
    ));
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
        item={item}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
      />
    </React.Fragment>
  );
}
