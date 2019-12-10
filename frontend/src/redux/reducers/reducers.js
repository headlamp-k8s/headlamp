import { combineReducers } from 'redux';
import filter from './filter';

const reducers = combineReducers({
  filter: filter,
});

export default reducers;
