import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addTheme as addThemeToConf,
  removeTheme as removeThemeFromConf,
  setTheme as setAppTheme,
  Theme,
} from '../../lib/themes';
import { AppLogoType } from './AppLogo';

export interface ThemeState {
  /**
   * The logo component to use for the app.
   */
  logo: AppLogoType;
  /**
   * The name of the active theme.
   */
  name: string;
  /**
   * The available themes.
   */
  availableThemes: string[];
}

export const initialState: ThemeState = {
  logo: null,
  name: '',
  availableThemes: [],
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    /**
     * Sets the logo component to use for the app.
     */
    setBrandingAppLogoComponent(state, action: PayloadAction<AppLogoType>) {
      state.logo = action.payload;
    },
    /**
     * Sets the theme name of the application.
     */
    setTheme(state, action: PayloadAction<string>) {
      state.name = action.payload;
      setAppTheme(state.name);
    },
    /**
     * Adds a new theme to the list of available themes.
     */
    addTheme(state, action: PayloadAction<{ name: string; theme: Theme }>) {
      const { name, theme } = action.payload;
      addThemeToConf(name, theme);
      state.availableThemes.push(name);
    },
    /**
     * Removes a theme from the list of available themes.
     */
    removeTheme(state, action: PayloadAction<string>) {
      const themeName = action.payload;
      removeThemeFromConf(themeName);
      state.availableThemes = state.availableThemes.filter(name => name !== themeName);
    },
  },
});

export const { setBrandingAppLogoComponent, setTheme, addTheme, removeTheme } = themeSlice.actions;
export { themeSlice };
export default themeSlice.reducer;
