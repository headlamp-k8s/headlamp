import { all } from 'redux-saga/effects';
import { watchClusterAction } from './clusterActions';
import { apiManagerAction } from './k8sApi';

export default function* rootSaga() {
  yield all([watchClusterAction(), apiManagerAction()]);
}
