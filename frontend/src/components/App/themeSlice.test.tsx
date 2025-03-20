import React from 'react';
import { AppLogoProps, AppLogoType } from './AppLogo';
import themeReducer, { setBrandingAppLogoComponent, setTheme, ThemeState } from './themeSlice';

describe('themeSlice', () => {
  const initialState: ThemeState = {
    logo: null,
    name: '',
    appThemes: [],
  };

  it('should handle initial state', () => {
    expect(themeReducer(undefined, { type: 'unknown' })).toEqual({
      logo: null,
      name: '',
    });
  });

  it('should handle setBrandingAppLogoComponent', () => {
    const MockComponent: React.ComponentType<AppLogoProps> = (props: AppLogoProps) => (
      <div {...props} />
    );
    const logo: AppLogoType = MockComponent;
    const actual = themeReducer(initialState, setBrandingAppLogoComponent(logo));
    expect(actual.logo).toEqual(logo);
  });

  it('should handle setTheme', () => {
    const themeName = 'dark';
    const actual = themeReducer(initialState, setTheme(themeName));
    expect(actual.name).toEqual(themeName);
  });
});
