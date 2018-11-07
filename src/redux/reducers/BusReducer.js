import * as bus from '../types/Bus';

const initialState = {
  loading: false,
  error: {},
  busLoc:[],
};

const busReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case bus.BUS_GET_STARTED:
      return {
          ...state,
          loading:true,
      }
    case bus.BUS_GET_COMPLETED:
      return {
        ...state,
        busLoc: payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default busReducer;
