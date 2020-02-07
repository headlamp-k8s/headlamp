import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { INITIAL_STATE as FILTER_INITIAL_STATE } from '../reducers/filter';
import reducers from '../reducers/reducers';
import { INITIAL_STATE as UI_INITIAL_STATE } from '../reducers/ui';
import rootSaga from '../sagas/sagas';

let initialState = {
  filter: FILTER_INITIAL_STATE,
  ui: UI_INITIAL_STATE,
};

const sagaMiddleware = createSagaMiddleware();

let store = createStore(
  reducers,
  initialState,
  applyMiddleware(sagaMiddleware),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;

sagaMiddleware.run(rootSaga);
