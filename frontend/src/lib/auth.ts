/*
 * This module was taken from the k8dash project.
 */

import store from '../redux/stores/store';

export function getToken(cluster: string) {
  const getTokenMethodToUse = store.getState().ui.functionsToOverride.getToken;
  const tokenMethodToUse =
    getTokenMethodToUse ||
    function () {
      return getTokens()[cluster];
    };
  return tokenMethodToUse(cluster);
}

export function getUserInfo(cluster: string) {
  const user = getToken(cluster).split('.')[1];
  return JSON.parse(atob(user));
}

export function hasToken(cluster: string) {
  return !!getToken(cluster);
}

function getTokens() {
  return JSON.parse(localStorage.tokens || '{}');
}

export function setToken(cluster: string, token: string | null) {
  const setTokenMethodToUse = store.getState().ui.functionsToOverride.setToken;
  if (setTokenMethodToUse) {
    setTokenMethodToUse(cluster, token);
  } else {
    const tokens = getTokens();
    tokens[cluster] = token;
    localStorage.tokens = JSON.stringify(tokens);
  }
}

export function deleteTokens() {
  delete localStorage.tokens;
}

export function logout() {
  deleteTokens();
}
