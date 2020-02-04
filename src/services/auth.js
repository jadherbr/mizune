import * as k from './keys';

export const getToken = () => localStorage.getItem(k.TOKEN_KEY);

export const login = (data, loginautomatico = false) => {
  if (loginautomatico) {
    localStorage.setItem(k.TOKEN_KEY, data.token.token);
    localStorage.setItem(k.USER_KEY, JSON.stringify(data.user));
  }
  sessionStorage.setItem(k.TOKEN_KEY, data.token.token);
  sessionStorage.setItem(k.USER_KEY, JSON.stringify(data.user));
};

export const isAuthenticated = () => {
  if (sessionStorage.getItem(k.TOKEN_KEY)) {
    return true;
  }
  if ((!sessionStorage.getItem(k.TOKEN_KEY)) && (localStorage.getItem(k.TOKEN_KEY))) {
    sessionStorage.setItem(k.TOKEN_KEY, localStorage.getItem(k.TOKEN_KEY));
    sessionStorage.setItem(k.USER_KEY, localStorage.getItem(k.USER_KEY));
    return true;
  }
  return false;
}

export function getAuthenticatedUser() {
  if (!isAuthenticated()) {
    return { username: '', email: '' };
  }
  let user = sessionStorage.getItem(k.USER_KEY);
  if (user === 'undefined' || user === null) {
    logout();
    return { username: '', email: '' };
  }
  return JSON.parse(user);
}

export const logout = () => {
  localStorage.removeItem(k.TOKEN_KEY);
  sessionStorage.removeItem(k.TOKEN_KEY);
  localStorage.removeItem(k.USER_KEY);
  sessionStorage.removeItem(k.USER_KEY);
};