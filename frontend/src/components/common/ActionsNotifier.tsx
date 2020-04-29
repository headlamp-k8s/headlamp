import Button from '@material-ui/core/Button';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { CLUSTER_ACTION_GRACE_PERIOD } from '../../lib/util';
import { ClusterAction } from '../../redux/actions/actions';
import { useTypedSelector } from '../../redux/reducers/reducers';

export default function ActionsNotifier() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const history = useHistory();
  const clusterActions = useTypedSelector(state => state.clusterAction);

  function handleAction(clusterAction: ClusterAction) {
    if (_.isEmpty(clusterAction)) {
      return;
    }

    if (clusterAction.url && history.location.pathname !== clusterAction.url) {
      history.push(clusterAction.url);
    }

    const action = () => (
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [clusterActions]);

  return null;
}
