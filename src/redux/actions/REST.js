import to from 'to-case';
import { toast } from 'react-toastify';
import { fetch }  from './Request';

import {
  ACTION_GET,
  ACTION_STARTED,
  ACTION_COMPLETED,
  ACTION_FAILED,
} from '../types/Common';

const __actionName = (group, method, action, step) => {
  return to.snake(group + ' ' + method + ' ' + (action || '') + ' ' + step).toUpperCase();
};

const __action = (type, path, method, id, params, payload, error) => {
  let action = { type, name: path };

  if (params) {
    action.params = params;
  }

  if (id) {
    action.objectId = id;
  }

  if (payload) {
    action.payload = payload;
  }

  if (error) {
    action.error = error;
  }

  return action;
};

const __dispatch = (group, action, method, params, dispatch, id, path_extras) => {
  let STARTED = __actionName(group, method, action, ACTION_STARTED);
  let COMPLETED = __actionName(group, method, action, ACTION_COMPLETED);
  let FAILED = __actionName(group, method, action, ACTION_FAILED);

  dispatch(__action(STARTED, action, method, id, params));

  let request;
  const PATH = group + (action ? '/' + action : '');

  // eslint-disable-next-line default-case
  switch (method) {
    case ACTION_GET:
      request = fetch(PATH, id, params, [], path_extras);
      break;
  }

  if (request) {
    return request.then(
      response => {
        if (response.body.message) {
          toast.success(response.body.message);
        }
        dispatch(__action(COMPLETED, action, method, id, params, response.body));
      },
      error => {
        if (error.status === 401) {

        } else {
          if (error.response && error.response.body && error.response.body.message) {
            toast.error(error.response.body.message);
          }

          dispatch(__action(FAILED, action, method, id, params, null, error.response.body));
        }
      }
    );
  }

  throw new Error(`Could not find a proper method for action "${method}"`);
};

export const get = (group, action, id, params) => dispatch => {
  return __dispatch(group, action, ACTION_GET, params, dispatch, id);
};