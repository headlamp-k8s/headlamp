import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { INITIAL_STATE as CONFIG_INITIAL_STATE } from '../reducers/config';
import { INITIAL_STATE as FILTER_INITIAL_STATE } from '../reducers/filter';
import reducers from '../reducers/reducers';
import { INITIAL_STATE as UI_INITIAL_STATE } from '../reducers/ui';
import rootSaga from '../sagas/sagas';

const initialState = {
  filter: FILTER_INITIAL_STATE,
  ui: UI_INITIAL_STATE,
  config: CONFIG_INITIAL_STATE,
};

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: reducers,
  preloadedState: initialState,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: false,
    }).concat(sagaMiddleware),
});

export default store;

sagaMiddleware.run(rootSaga);
