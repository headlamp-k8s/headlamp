import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { INITIAL_STATE as FILTER_INITIAL_STATE } from '../reducers/filter';
import reducers from '../reducers/reducers';
import rootSaga from '../sagas/sagas';

const initialState = {
  filter: FILTER_INITIAL_STATE,
};

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  reducers,
  initialState,
  applyMiddleware(sagaMiddleware),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;

sagaMiddleware.run(rootSaga);
