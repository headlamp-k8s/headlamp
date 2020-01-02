import { combineReducers } from 'redux';
import deletion from './deletion';
import filter from './filter';

const reducers = combineReducers({
  filter: filter,
  deletion: deletion,
});

export default reducers;
