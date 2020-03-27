/*
 * This module was taken from the k8dash project.
 */

import * as cookie from 'js-cookie';

// If we have an "Authorization" cookie, use that as the token for future api calls
const authorizationCookie = cookie.get('Authorization');
if (authorizationCookie) {
  setToken(authorizationCookie);
  cookie.remove('Authorization');
}

export function getToken(cluster) {
  return getTokens()[cluster];
}

export function getUserInfo(cluster) {
  const user = getToken(cluster).split('.')[1];
  return JSON.parse(atob(user));
}

export function hasToken(cluster) {
  return !!getToken(cluster);
}

function getTokens() {
  return JSON.parse(localStorage.tokens || '{}');
}

export function setToken(cluster, token) {
  const tokens = getTokens();
  tokens[cluster] = token;
  localStorage.tokens = JSON.stringify(tokens);
}

export function deleteTokens() {
  delete localStorage.tokens;
}

export function logout() {
  deleteTokens();
  //window.location.reload();
}
