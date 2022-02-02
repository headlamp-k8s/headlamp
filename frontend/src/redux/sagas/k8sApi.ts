import { all, call, delay, put, select, takeEvery } from 'redux-saga/effects';
import { ApiError } from '../../lib/k8s/apiProxy';
import { KubeObject } from '../../lib/k8s/cluster';
import {
  K8S_API_DROP_LIST_RESOURCE,
  K8S_API_LIST_RESOURCE,
  K8S_API_SET_RESOURCE_LIST,
  K8sApiAction,
} from '../actions/api';
import { INITIAL_STATE } from '../reducers/api';
import store from '../stores/store';

const ApiCallManager: {
  [clusterName: string]: {
    [resourceName: string]: {
      refs: number;
      cancelFn: () => void;
    };
  };
} = {};

export function* apiManagerAction() {
  yield all([
    takeEvery(K8S_API_LIST_RESOURCE, listResourceAction),
    takeEvery(K8S_API_DROP_LIST_RESOURCE, k8sDropListResource),
  ]);
}

function* k8sDropListResource(action: K8sApiAction) {
  const className = action.resourceClass.className;

  refDown(action);
  console.debug('Ref down', className, getRef(action));

  if (getRef(action) === 0) {
    yield delay(2000);
    if (getRef(action) === 0) {
      console.debug('Stop call and drop cache for', className);
      const cluster =
        ApiCallManager[action.clusterName] || (ApiCallManager[action.clusterName] = {});

      if (cluster[className]) {
        cluster[className].cancelFn();

        yield put({
          type: K8S_API_SET_RESOURCE_LIST,
          resourceClass: className,
          clusterName: action.clusterName,
          list: null,
          time: new Date(),
          error: null,
        });
      }
    } else {
      console.debug('Do not drop cache for', className);
    }
  }

  const currentCache: typeof INITIAL_STATE = yield select(state => state.api);
  console.debug('Current cache', currentCache);
}

function setResourceList(action: K8sApiAction, objList: KubeObject) {
  if (!action.resourceClass) {
    return;
  }
  store.dispatch({
    type: K8S_API_SET_RESOURCE_LIST,
    resourceClass: action.resourceClass.className,
    clusterName: action.clusterName,
    list: objList,
    time: new Date(),
    error: null,
  });
}

function setResourceListError(action: K8sApiAction, err: ApiError) {
  if (!action.resourceClass) {
    return;
  }
  store.dispatch({
    type: K8S_API_SET_RESOURCE_LIST,
    resourceClass: action.resourceClass.className,
    clusterName: action.clusterName,
    list: [],
    time: new Date(),
    error: err,
  });
}

function changeRef(action: K8sApiAction, diff: number) {
  const cluster = ApiCallManager[action.clusterName] || (ApiCallManager[action.clusterName] = {});
  const className = action.resourceClass.className;
  if (cluster[className]) {
    cluster[className].refs = cluster[className].refs + diff;
  }
}

function refUp(action: K8sApiAction) {
  changeRef(action, 1);
}

function refDown(action: K8sApiAction) {
  changeRef(action, -1);
}

function getRef(action: K8sApiAction) {
  const cluster = ApiCallManager[action.clusterName] || (ApiCallManager[action.clusterName] = {});
  if (cluster[action.resourceClass.className]) {
    return cluster[action.resourceClass.className].refs;
  }
  return -1;
}

function* listResourceAction(action: K8sApiAction) {
  const cluster = ApiCallManager[action.clusterName] || (ApiCallManager[action.clusterName] = {});
  if (getRef(action) > 0) {
    refUp(action);
    console.debug('Ref up existing', action.resourceClass.className, getRef(action));
  } else {
    const listFn = action.resourceClass.apiList(
      (objs: KubeObject[]) => setResourceList(action, objs),
      setResourceListError
    );
    const cancelCb: () => void = yield call(listFn);
    cluster[action.resourceClass.className] = {
      refs: 1,
      cancelFn: cancelCb,
    };
    console.debug('Ref new', action.resourceClass.className, getRef(action));
  }

  const currentCache: typeof INITIAL_STATE = yield select(state => state.api);
  console.debug('Current cache', currentCache);
}
