import Button from '@mui/material/Button';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { CLUSTER_ACTION_GRACE_PERIOD, ClusterAction } from '../../redux/clusterActionSlice';
import { useTypedSelector } from '../../redux/reducers/reducers';

export interface PureActionsNotifierProps {
  clusterActions: { [x: string]: ClusterAction };
  dispatch: (action: { type: string }) => void;
}

function PureActionsNotifier({ dispatch, clusterActions }: PureActionsNotifierProps) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const history = useHistory();
  const snackbarRefs = useRef<{ [id: string]: string | undefined }>({});

  function handleAction(clusterAction: ClusterAction) {
    if (_.isEmpty(clusterAction)) {
      return;
    }

    if (clusterAction.url && history.location.pathname !== clusterAction.url) {
      history.push(clusterAction.url);
    }

    const action = () => (
      <React.Fragment>
        {(clusterAction.buttons || []).map(({ label, actionToDispatch }, i) => (
          <Button
            key={i}
            color="secondary"
            size="small"
            onClick={() => {
              dispatch({ type: actionToDispatch });
            }}
          >
            {label}
          </Button>
        ))}
      </React.Fragment>
    );

    // The original idea was to reuse the Snackbar with the same key.
    // However, with notistack it proved to be complicated, so we dismiss+show
    // Snackbars as needed instead.
    if (clusterAction.dismissSnackbar) {
      closeSnackbar(clusterAction.dismissSnackbar);
    }

    const prevKey = snackbarRefs.current[clusterAction.id];
    const uniqueKey = clusterAction.key || clusterAction.id;

    if (prevKey && prevKey !== uniqueKey) {
      closeSnackbar(prevKey);
    }

    if (clusterAction.message) {
      // Check for completed actions
      const refKey =
        clusterAction.state === 'complete' ? `${clusterAction.id}-complete` : clusterAction.id;

      if (!snackbarRefs.current[refKey]) {
        snackbarRefs.current[refKey] = uniqueKey;
        enqueueSnackbar(clusterAction.message, {
          key: uniqueKey,
          autoHideDuration: clusterAction.autoHideDuration || CLUSTER_ACTION_GRACE_PERIOD,
          action,
          ...clusterAction.snackbarProps,
        });
      }
    }
  }

  React.useEffect(
    () => {
      for (const clusterAction of Object.values(clusterActions)) {
        handleAction(clusterAction);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clusterActions]
  );

  React.useEffect(() => {
    return () => {
      Object.keys(snackbarRefs.current).forEach(key => {
        closeSnackbar(snackbarRefs.current[key]);
        delete snackbarRefs.current[key];
      });
    };
  }, [closeSnackbar]);

  return null;
}

export { PureActionsNotifier };

export default function ActionsNotifier() {
  const dispatch = useDispatch();
  const clusterActions = useTypedSelector(state => state.clusterAction, _.isEqual);

  return <PureActionsNotifier dispatch={dispatch} clusterActions={clusterActions} />;
}
