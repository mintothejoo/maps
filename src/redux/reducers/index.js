import { combineReducers } from 'redux';
import busReducer from './BusReducer';

const rootReducer = combineReducers({
  busReducer,
});

export default rootReducer;
