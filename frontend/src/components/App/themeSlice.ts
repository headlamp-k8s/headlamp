import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setTheme as setAppTheme } from '../../lib/themes';
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
}

export const initialState: ThemeState = {
  logo: null,
  name: '',
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
  },
});

export const { setBrandingAppLogoComponent, setTheme } = themeSlice.actions;
export { themeSlice };
export default themeSlice.reducer;
