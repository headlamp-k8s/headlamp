/*
 * This module was taken from the k8dash project.
 */

export function getToken(cluster: string) {
  return getTokens()[cluster];
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
  const tokens = getTokens();
  tokens[cluster] = token;
  localStorage.tokens = JSON.stringify(tokens);
}

export function deleteTokens() {
  delete localStorage.tokens;
}

export function logout() {
  deleteTokens();
}
