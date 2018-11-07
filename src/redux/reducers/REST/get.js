export const get = (action, state, STARTED, COMPLETED, FAILED) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case STARTED:
        state.processing = true;
        break;
      case COMPLETED:
        state.processing = false;
        if (typeof state[action.name] === 'object') {
          state[action.name] = Object.assign(state[action.name], action.payload);
        } else {
          state[action.name] = action.payload;
        }
        state.error = false;
        break;
      case FAILED:
        state.processing = false;
        state.error = action.error;
        break;
    }
  
    return state;
  };
  