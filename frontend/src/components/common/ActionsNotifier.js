import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import { cancelDeleteClusterObjects } from '../../redux/actions/actions';

export default function ActionsNotifier() {
  let message = '';
  const [open, setOpen] = React.useState(false);
  const deletion = useSelector(state => state.deletion);
  const dispatch = useDispatch();
  const history = useHistory();

  function handleClose() {
    setOpen(false);
  }

  const itemsString = `${deletion.items.map(item => item.metadata.name).join(', ').slice(0, 25)}`;

  switch (deletion.status) {
    case 'start':
      message = `Deleting ${itemsString}…`;
      break;
    case 'success':
      message = `Deleted ${itemsString}…`;
      break;
    case 'cancelled':
      message = 'Cancelled!';
      break;
    default:
      break;
  }

  if (deletion.status != '' ^ open) {
    setOpen(deletion.status != '');
  }

  if (deletion.url !== null && history.location.pathname != deletion.url) {
    history.push(deletion.url);
  }

  function handleDeleteCancellation() {
    if (isCancellable()) {
      dispatch(cancelDeleteClusterObjects());
    }
  }

  function isCancellable() {
    return deletion.status == 'start';
  }

  return (
    <Snackbar
      key={deletion.status}
      open={open}
      onClose={handleClose}
      ContentProps={{
        'aria-describedby': 'message-id',
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      autoHideDuration={3000}
      message={<span id="message-id">{message}</span>}
      action={isCancellable() && [
        <Button key="cancel" color="secondary" size="small" onClick={handleDeleteCancellation}>
          Cancel
        </Button>
      ]}
    />
  );
}
