import i18next from 'i18next';
import { all, call, cancelled, delay, put, race, take, takeEvery } from 'redux-saga/effects';
import { CLUSTER_ACTION_GRACE_PERIOD } from '../../lib/util';
import {
  Action,
  CallbackAction,
  CLUSTER_ACTION,
  CLUSTER_ACTION_CANCEL,
  ClusterAction,
  updateClusterAction,
} from '../actions/actions';

function newActionKey() {
  return (new Date().getTime() + Math.random()).toString();
}

function* watchClusterAction() {
  yield takeEvery(CLUSTER_ACTION, clusterActionWithCancellation);
}

function* clusterActionWithCancellation(action: Action & CallbackAction) {
  const actionKey = newActionKey();
  // We create a unique action type so we're sure that the cancellation
  // is done on the right actions.
  const uniqueCancelAction = CLUSTER_ACTION_CANCEL + actionKey;
  yield race({
    task: call(doClusterAction, action, actionKey, uniqueCancelAction),
    cancel: take(uniqueCancelAction),
  });
}

function* doClusterAction(action: CallbackAction, actionKey: string, uniqueCancelAction: string) {
  const {
    callback,
    startUrl,
    cancelUrl,
    successUrl,
    startMessage,
    cancelledMessage,
    errorMessage,
    errorUrl,
    successMessage,
    startOptions = {},
    cancelledOptions = {},
    successOptions = { variant: 'success' },
    errorOptions = { variant: 'error' },
  } = action;

  try {
    yield put(
      updateClusterAction({
        key: actionKey,
        id: actionKey,
        message: startMessage,
        url: startUrl,
        buttons: [
          {
            label: i18next.t('frequent|Cancel'),
            actionToDispatch: uniqueCancelAction,
          },
        ],
        snackbarProps: startOptions,
      })
    );

    yield delay(CLUSTER_ACTION_GRACE_PERIOD);
  } finally {
    // Check if it's been cancelled.
    // @ts-ignore: TS7057
    // @todo: Seems to be an bad-typing issue... this code is idiomatic and did check before.
    if (yield cancelled()) {
      yield put(
        updateClusterAction({
          id: actionKey,
          message: cancelledMessage,
          dismissSnackbar: actionKey,
          url: cancelUrl,
          snackbarProps: cancelledOptions,
        })
      );
    } else {
      // Actually perform the action. This part is no longer cancellable,
      // so it's here instead of within the try block.
      let success = false;
      try {
        yield call(callback);
        success = true;
      } catch (err) {
        // @todo: It'd be interesting to make the errorMessage a callback and
        // pass it the error when using the errorMessage below.
      }

      let clusterAction: ClusterAction;

      if (success) {
        clusterAction = {
          id: actionKey,
          url: successUrl,
          dismissSnackbar: actionKey,
          message: successMessage,
          snackbarProps: successOptions,
        };
      } else {
        clusterAction = {
          id: actionKey,
          url: errorUrl,
          dismissSnackbar: actionKey,
          message: errorMessage,
          snackbarProps: errorOptions,
        };
      }

      yield put(updateClusterAction(clusterAction));
    }

    // Reset state if no other deletion happens
    const { timeout } = yield race({
      newAction: take(CLUSTER_ACTION),
      timeout: delay(3000),
    });

    // Reset the cluster action
    if (timeout) {
      yield put(
        updateClusterAction({
          id: actionKey,
        })
      );
    }
  }
}

export default function* rootSaga() {
  yield all([watchClusterAction()]);
}
