import { createActions, createReducer } from "reduxsauce";

/**
 * Action types & creators
 */
export const { Types, Creators } = createActions({
  updateLoading: ["loading"]
});



/**
 * Handlers
 */
const INITIAL_STATE = {loading: false};

const update = (state = INITIAL_STATE, action) => {
  return { ...state, loading: action.loading }
}

/**
 * Reducer
 */
export default createReducer(INITIAL_STATE, {
  [Types.UPDATE_LOADING]: update  
});