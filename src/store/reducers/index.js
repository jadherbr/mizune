import { combineReducers } from 'redux';

import loggedUser from "./loggedUser";
import loading from "./loading";

export default combineReducers ({
  loggedUser, loading
})