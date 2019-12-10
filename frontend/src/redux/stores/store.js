import { createStore } from 'redux';
import { INITIAL_STATE as FILTER_INITIAL_STATE } from '../reducers/filter';
import reducers from '../reducers/reducers';

const initialState = {
  filter: FILTER_INITIAL_STATE,
};

export default createStore(
  reducers,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
