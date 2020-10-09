import deleteIcon from '@iconify/icons-mdi/delete';
import { Icon } from '@iconify/react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { KubeObject } from '../../lib/k8s/cluster';
import { CallbackActionOptions, clusterAction } from '../../redux/actions/actions';
import { ConfirmDialog } from './Dialog';

interface DeleteButtonProps {
  item?: KubeObject;
  options?: CallbackActionOptions;
}

export default function DeleteButton(props: DeleteButtonProps) {
  const dispatch = useDispatch();
  const { item, options } = props;
  const [openAlert, setOpenAlert] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const location = useLocation();

  const deleteFunc = React.useCallback(() => {
    if (!item) {
      return;
    }

    const callback = item!.delete;

    callback && dispatch(clusterAction(callback.bind(item),
      {
        startMessage: `Deleting item ${item!.metadata.name}…`,
        cancelledMessage: `Cancelled deletion of ${item!.metadata.name}.`,
        successMessage: `Deleted item ${item!.metadata.name}.`,
        errorMessage: `Error deleting item ${item!.metadata.name}.`,
        cancelUrl: location.pathname,
        startUrl: item!.getListLink(),
        errorUrl: item!.getListLink(),
        ...options
      }
    ));
  },
  // eslint-disable-next-line
  [item]);

  React.useEffect(() => {
    if (item) {
      item.getAuthorization('delete').then(
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
      <Tooltip title="Delete">
        <IconButton
          aria-label="delete"
          onClick={() => setOpenAlert(true)}
        >
          <Icon icon={deleteIcon} />
        </IconButton>
      </Tooltip>
      <ConfirmDialog
        open={openAlert}
        title="Delete item"
        description="Are you sure you want to delete this item?"
        handleClose={() => setOpenAlert(false)}
        onConfirm={() => deleteFunc() }
      />
    </React.Fragment>
  );
}
