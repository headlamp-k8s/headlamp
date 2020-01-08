import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import _ from 'lodash';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";

export default function ActionsNotifier() {
  const [open, setOpen] = React.useState(false);
  const clusterAction = useSelector(state => state.clusterAction);
  const dispatch = useDispatch();
  const history = useHistory();

  function handleClose() {
    setOpen(false);
  }

  const actionIsEmpty = _.isEmpty(clusterAction);
  if (!actionIsEmpty ^ open) {
    setOpen(!actionIsEmpty);
  }

  if (clusterAction.url && history.location.pathname != clusterAction.url) {
    history.push(clusterAction.url);
  }

  return (
    <Snackbar
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
      message={<span id="message-id">{clusterAction.message}</span>}
      action={(clusterAction.buttons || []).map(({label, actionToDispatch}, i) =>
        <Button
          key={i}
          color="secondary"
          size="small"
          onClick={() => dispatch({type: actionToDispatch})}
        >
          {label}
        </Button>
      )}
    />
  );
}
