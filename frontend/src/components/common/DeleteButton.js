import deleteIcon from '@iconify/icons-mdi/delete';
import { Icon } from '@iconify/react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import api from '../../lib/api';
import { clusterAction } from '../../redux/actions/actions';
import { ConfirmDialog } from './Dialog';

export default function DeleteButton(props) {
  const dispatch = useDispatch();
  const { item, deletionCallback, options } = props;
  const [openAlert, setOpenAlert] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    if (item && item.metadata) {
      api.getAuthorization(item, 'delete').then(
        result => {
          if (result.status.allowed) {
            setVisible(true);
          }
        }
      );
    }
  },
  [item]);

  return visible && (
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
        onConfirm={() => {
          dispatch(clusterAction(deletionCallback,
            {
              startMessage: `Deleting item ${item.metadata.name}…`,
              cancelledMessage: `Cancelled deleting ${item.metadata.name}.`,
              successMessage: `Deleted item ${item.metadata.name}.`,
              cancelUrl: location.pathname,
              ...options
            }
          ));
        }}
      />
    </React.Fragment>
  );
}
