import { all, call, cancelled, delay, put, race, take, takeEvery } from 'redux-saga/effects';
import { CLUSTER_ACTION_GRACE_PERIOD } from '../../lib/cluster';
import { CLUSTER_ACTION, CLUSTER_ACTION_CANCEL, updateClusterAction } from '../actions/actions';

function* watchClusterAction() {
  yield takeEvery(CLUSTER_ACTION, clusterActionWithCancellation);
}

function* clusterActionWithCancellation(action) {

  yield race({
    task: call(doClusterAction, action),
    cancel: take(CLUSTER_ACTION_CANCEL),
  });
}

function* doClusterAction(action) {
  const {
    type,
    actionCallback,
    startUrl,
    cancelUrl,
    successUrl,
    startMessage,
    cancelledMessage,
    successMessage,
    ...options
  } = action;

  try {
    yield put(updateClusterAction({
      message: startMessage,
      url: startUrl,
      buttons: [
        {
          label: 'Cancel',
          actionToDispatch: CLUSTER_ACTION_CANCEL,
        },
      ],
      ...options
    }));
    yield delay(CLUSTER_ACTION_GRACE_PERIOD);
  } finally {
    // Check if it's been cancelled.
    if (yield cancelled()) {
      yield put(updateClusterAction({
        message: cancelledMessage,
        url: cancelUrl,
      }));
    } else {
      // Actually perform the action.
      yield call(actionCallback);

      yield put(updateClusterAction({
        message: successMessage
      }));
    }

    // Reset state if no other deletion happens
    const {timeout} = yield race({
      newAction: take(CLUSTER_ACTION),
      timeout: delay(3000)
    });

    // Reset the cluster action
    if (timeout) {
      yield put(updateClusterAction({}));
    }
  }
}

export default function* rootSaga() {
  yield all([
    watchClusterAction(),
  ]);
}
