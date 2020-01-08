import { all, call, cancelled, delay, put, race, take, takeEvery } from 'redux-saga/effects';
import { CLUSTER_ACTION_GRACE_PERIOD } from '../../lib/cluster';
import { CLUSTER_ACTION, CLUSTER_ACTION_CANCEL, updateClusterAction } from '../actions/actions';

function newActionKey() {
  return toString(new Date().getTime() + Math.random());
}

function* watchClusterAction() {
  yield takeEvery(CLUSTER_ACTION, clusterActionWithCancellation);
}

function* clusterActionWithCancellation(action) {
  const actionKey = newActionKey();
  // We create a unique action type so we're sure that the cancellation
  // is done on the right actions.
  const uniqueCancelAction = CLUSTER_ACTION_CANCEL + actionKey;
  yield race({
    task: call(doClusterAction, action, actionKey, uniqueCancelAction),
    cancel: take(uniqueCancelAction),
  });
}

function* doClusterAction(action, actionKey, uniqueCancelAction) {
  const {
    type,
    actionCallback,
    startUrl,
    cancelUrl,
    successUrl,
    startMessage,
    cancelledMessage,
    successMessage,
    startOptions={},
    cancelledOptions={},
    successOptions={},
  } = action;

  try {
    yield put(updateClusterAction({
      key: actionKey,
      id: actionKey,
      message: startMessage,
      url: startUrl,
      buttons: [
        {
          label: 'Cancel',
          actionToDispatch: uniqueCancelAction,
        },
      ],
      snackbarProps: startOptions,
    }));

    yield delay(CLUSTER_ACTION_GRACE_PERIOD);
  } finally {
    // Check if it's been cancelled.
    if (yield cancelled()) {
      yield put(updateClusterAction({
        id: actionKey,
        message: cancelledMessage,
        dismissSnackbar: actionKey,
        url: cancelUrl,
        snackbarProps: cancelledOptions,
      }));
    } else {
      // Actually perform the action. This part is no longer cancellable,
      // so it's here instead of within the try block.
      // @todo: Handle exceptions.
      yield call(actionCallback);

      yield put(updateClusterAction({
        id: actionKey,
        url:successUrl,
        dismissSnackbar: actionKey,
        message: successMessage,
        snackbarProps: successOptions,
      }));
    }

    // Reset state if no other deletion happens
    const {timeout} = yield race({
      newAction: take(CLUSTER_ACTION),
      timeout: delay(3000)
    });

    // Reset the cluster action
    if (timeout) {
      yield put(updateClusterAction({
        id: actionKey
      }));
    }
  }
}

export default function* rootSaga() {
  yield all([
    watchClusterAction(),
  ]);
}
