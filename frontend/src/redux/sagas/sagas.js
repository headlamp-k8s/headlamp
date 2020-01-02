import { all, call, cancelled, delay, put, race, take, takeEvery } from 'redux-saga/effects';
import { DELETION_GRACE_PERIOD } from '../../lib/cluster';
import { CLUSTER_OBJECTS_CANCEL_DELETE, CLUSTER_OBJECTS_DELETE, clusterObjectsDeleted, deleteClusterObjectsCancelled, startDeleteClusterObjects } from '../actions/actions';

function* watchDeleteClusterObject() {
  yield takeEvery(CLUSTER_OBJECTS_DELETE, deleteClusterObjectWithCancellation);
}

function* deleteClusterObjectWithCancellation(action) {
  yield race({
    task: call(deleteClusterObject, action),
    cancel: take(CLUSTER_OBJECTS_CANCEL_DELETE),
  });
}

function* deleteClusterObject(action) {
  const { items, options, deleteCallback } = action;
  try {
    yield put(startDeleteClusterObjects(items, {url: options.startUrl}));
    yield delay(DELETION_GRACE_PERIOD);

    // Actually delete the object.
    deleteCallback();

    yield put(clusterObjectsDeleted(items, {url: options.successUrl}));
  } finally {
    if (yield cancelled()) {
      yield put(deleteClusterObjectsCancelled(items, {url: options.cancelUrl}));
    }

    // Reset state if no other deletion happens
    const {timeout} = yield race({
      newDeletion: take(CLUSTER_OBJECTS_DELETE),
      timeout: delay(3000)
    });

    if (timeout) {
      yield put(clusterObjectsDeleted([]));
    }
  }
}

export default function* rootSaga() {
  yield all([
    watchDeleteClusterObject(),
  ]);
}
