import { createActions, createReducer } from "reduxsauce";
import { getAuthenticatedUser } from "../../services/auth";
const cloggedUser = getAuthenticatedUser();

/**
 * Action types & creators
 */
export const { Types, Creators } = createActions({
  updateUser: ["user"]
});

/**
 * Handlers
 */
const INITIAL_STATE = {
  user: {
    username: cloggedUser.username,
    email: cloggedUser.email,
  }
}
const update = (state = INITIAL_STATE, action) => {
  return { ...state, user: action.user }
}

/**
 * Reducer
 */
export default createReducer(INITIAL_STATE, {
  [Types.UPDATE_USER]: update  
});