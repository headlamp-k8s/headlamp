import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppTheme } from '../../lib/AppTheme';
import { getThemeName, setTheme as setAppTheme } from '../../lib/themes';
import { useTypedSelector } from '../../redux/reducers/reducers';
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
  /** List of all custom App Themes */
  appThemes: AppTheme[];
}

const headlampClassicLightTheme: AppTheme = {
  name: 'Headlamp Classic',
  primary: '#222',
  secondary: '#eaeaea',
  sidebar: {
    background: '#242424',
    color: '#FFF',
    selectedBackground: '#ebe811',
    selectedColor: '#ebe811',
    actionBackground: '#605e5c',
  },
  navbar: {
    background: '#FFF',
    color: '#202020',
  },
  radius: 4,
};

const darkTheme: AppTheme = {
  name: 'dark',
  base: 'dark',
  primary: '#1f6feb',
  secondary: '#262c36',
  text: {
    primary: '#f0f6fc',
  },
  background: {
    default: '#0d1117',
    paper: '#0d1117',
    muted: '#151b23',
  },
  navbar: {
    background: '#010409',
    color: '#9198a1',
  },
  sidebar: {
    background: '#0d1117',
    color: '#f0f6fc',
    selectedBackground: '#656c7633',
    selectedColor: '#eaeaea',
    actionBackground: '#238636',
  },
  buttonTextTransform: 'none',
  radius: 6,
};

const lightTheme: AppTheme = {
  name: 'light',
  primary: '#44444f',
  secondary: '#eff2f5',
  text: {
    primary: '#44444f',
  },
  background: {
    muted: '#fafafd',
  },
  sidebar: {
    background: '#fafaff',
    color: '#59636e',
    selectedBackground: '#44444f',
    selectedColor: '#222',
    actionBackground: '#44444f',
  },
  navbar: {
    background: '#fafaff',
    color: '#59636e',
  },
  buttonTextTransform: 'none',
  radius: 8,
};

const defaultAppThemes = [lightTheme, darkTheme, headlampClassicLightTheme];

export const initialState: ThemeState = {
  logo: null,
  name: getThemeName(),
  appThemes: defaultAppThemes,
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
    addCustomAppTheme(state, action: PayloadAction<AppTheme>) {
      state.appThemes = state.appThemes.filter(it => it.name !== action.payload.name);
      state.appThemes.push(action.payload);
    },
  },
});

export const useAppThemes = () => {
  return useTypedSelector(state => state.theme.appThemes);
};

export const useCurrentAppTheme = () => {
  let themeName = useTypedSelector(state => state.theme.name);
  if (!themeName) {
    themeName = getThemeName();
  }
  const allThemes = useAppThemes();

  return allThemes.find(it => it.name === themeName) ?? defaultAppThemes[0];
};

export const { setBrandingAppLogoComponent, setTheme } = themeSlice.actions;
export { themeSlice };
export default themeSlice.reducer;
