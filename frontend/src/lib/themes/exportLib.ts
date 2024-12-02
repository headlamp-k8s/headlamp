import { setTheme as setThemeRedux } from '../../components/App/themeSlice';
import store from '../../redux/stores/store';
import { createTheme, Theme, ThemeOptions } from '.';
import BaseTheme, { BaseThemeOptions } from './baseTheme';
import DarkTheme, { DarkThemeOptions } from './darkTheme';

export type { Theme, ThemeOptions };

/**
 * Changes the theme of the application.
 * @param themeName The name of the theme to set.
 */
function setTheme(themeName: string) {
  store.dispatch(setThemeRedux(themeName));
}

/**
 * Returns an array of available theme names.
 * @returns An array of available theme names.
 */
function getAvailableThemes() {
  return [...store.getState().theme.availableThemes];
}

export {
  createTheme,
  setTheme,
  getAvailableThemes,
  BaseTheme as LightTheme,
  BaseThemeOptions as LightThemeOptions,
  DarkTheme,
  DarkThemeOptions,
};
