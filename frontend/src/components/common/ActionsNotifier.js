import Button from '@material-ui/core/Button';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import { CLUSTER_ACTION_GRACE_PERIOD } from '../../lib/cluster';

export default function ActionsNotifier() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const history = useHistory();
  const clusterActions = useSelector(state => state.clusterAction);

  function handleAction(clusterAction) {
    if (_.isEmpty(clusterAction)) {
      return;
    }

    if (clusterAction.url && history.location.pathname != clusterAction.url) {
      history.push(clusterAction.url);
    }

    const action = _key => (
      <React.Fragment>
        {(clusterAction.buttons || []).map(({label, actionToDispatch}, i) =>
          <Button
            key={i}
            color="secondary"
            size="small"
            onClick={() => {
              dispatch({type: actionToDispatch});
            }}
          >
            {label}
          </Button>
        )}
      </React.Fragment>
    );

    // The original idea was to reuse the Snackbar with the same key.
    // However, with notistack it proved to be complicated, so we dismiss+show
    // Snackbars as needed instead.
    if (clusterAction.dismissSnackbar) {
      closeSnackbar(clusterAction.dismissSnackbar);
    }

    const {key, message, snackbarProps} = clusterAction;
    enqueueSnackbar(message, {
      key,
      preventDuplicate: true,
      autoHideDuration: CLUSTER_ACTION_GRACE_PERIOD,
      action,
      ...snackbarProps
    });
  }

  React.useEffect(() => {
    for (const clusterAction of Object.values(clusterActions)) {
      handleAction(clusterAction);
    }
  },
  [clusterActions]);

  return null;
}
