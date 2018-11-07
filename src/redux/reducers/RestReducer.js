import to from 'to-case';

import { get } from './REST/get';

import {
  ACTION_GET,
  ACTION_STARTED,
  ACTION_COMPLETED,
  ACTION_FAILED,
} from '../types/Common';

export const REST = (group, action, state) => {
  let newState = Object.assign({}, state);

  if (!action.hasOwnProperty('name')) {
    return newState;
  }

  let found = action.type.match(/(CUSTOM_GET|CUSTOM_LIST|GET|LIST|POST|PUT|DELETE)/i);
  let method = '';

  if (found) {
    method = found[0];
  }

  let createActionName = suffix => {
    let name = group + ' ' + method + ' ' + (action.name || '') + ' ' + suffix;

    return to.snake(name).toUpperCase();
  };

  if (action.type.indexOf(group.toUpperCase()) === 0) {
    const STARTED = createActionName(ACTION_STARTED);
    const COMPLETED = createActionName(ACTION_COMPLETED);
    const FAILED = createActionName(ACTION_FAILED);

    let newAction = Object.assign({}, action);
    newAction.name = to.snake(newAction.name || '');

    // eslint-disable-next-line default-case
    switch (method) {
      case ACTION_GET:
        newState = get(newAction, newState, STARTED, COMPLETED, FAILED);
        break;
    }
  }

  return newState;
};
