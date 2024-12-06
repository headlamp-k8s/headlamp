import {
  createTheme as createMuiTheme,
  Theme as MuiTheme,
  ThemeOptions as MuitThemesOptions,
} from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import React from 'react';
import lightTheme from './baseTheme';
import darkTheme from './darkTheme';

declare module '@mui/material/styles' {
  interface Palette {
    squareButton: {
      background: string;
    };
    // @todo: Deprecate this
    primaryColor: string;
    sidebarLink: {
      color: string;
      main: {
        selected: {
          color: string;
          backgroundColor: string;
        };
        color: string;
      };
      selected: {
        color: string;
        backgroundColor: string;
      };
      hover: {
        color: string;
        backgroundColor: string;
      };
    };
    clusterChooser: {
      button: {
        color: string;
        background: string;
        hover: {
          background: string;
        };
      };
    };
    sidebarButtonInLinkArea: {
      color: string;
      primary: {
        background: string;
      };
      hover: {
        background: string;
      };
    };
    home: {
      status: {
        error: string;
        success: string;
        warning: string;
        unknown: string;
      };
    };
    sidebarBg: string;
    resourceToolTip: {
      color: string;
    };
    normalEventBg: string;
    chartStyles: {
      defaultFillColor: string;
      fillColor: string;
      labelColor: string;
    };
    metadataBgColor: string;
    headerStyle: {
      normal: {
        fontSize: string;
        fontWeight: string;
      };
      main: {
        fontSize: string;
        fontWeight: string;
      };
      subsection: {
        fontSize: string;
        fontWeight: string;
      };
      label: {
        fontSize: string;
        paddingTop: string;
      };
    };
    tables: {
      head: {
        background: string;
        color: string;
        borderColor: string;
      };
      body: {
        background: string;
      };
    };
    notificationBorderColor: string;
  }

  interface PaletteOptions {
    // @todo: Deprecate this
    primaryColor?: string;
    squareButton?: {
      background?: string;
    };
    sidebarLink?: {
      color?: string;
      main?: {
        selected?: {
          color?: string;
          backgroundColor?: string;
        };
        color?: string;
      };
      selected?: {
        color?: string;
        backgroundColor?: string;
      };
      hover?: {
        color?: string;
        backgroundColor?: string;
      };
    };
    clusterChooser?: {
      button?: {
        color?: string;
        background?: string;
        hover?: {
          background?: string;
        };
      };
    };
    sidebarButtonInLinkArea?: {
      color?: string;
      primary?: {
        background?: string;
      };
      hover?: {
        background?: string;
      };
    };
    home?: {
      status?: {
        error?: string;
        success?: string;
        warning?: string;
        unknown?: string;
      };
    };
    sidebarBg?: string;
    resourceToolTip?: {
      color?: string;
    };
    normalEventBg?: string;
    chartStyles?: {
      defaultFillColor?: string;
      fillColor?: string;
      labelColor?: string;
    };
    metadataBgColor?: string;
    headerStyle?: {
      normal?: {
        fontSize?: string;
        fontWeight?: string;
      };
      main?: {
        fontSize?: string;
        fontWeight?: string;
      };
      subsection?: {
        fontSize?: string;
        fontWeight?: string;
      };
      label?: {
        fontSize?: string;
        paddingTop?: string;
      };
    };
    tables?: {
      head?: {
        background?: string;
        color?: string;
        borderColor?: string;
      };
      body?: {
        background?: string;
      };
    };
    notificationBorderColor?: string;
  }
}

export type Theme = MuiTheme;
export type ThemeOptions = MuitThemesOptions;

export interface ThemesConf {
  [themeName: string]: Theme;
}

const themesConf: ThemesConf = {
  light: lightTheme,
  dark: darkTheme,
};

export default themesConf;

export function usePrefersColorScheme() {
  if (typeof window.matchMedia !== 'function') {
    return 'light';
  }

  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const [value, setValue] = React.useState(mql.matches);

  React.useEffect(() => {
    const handler = (x: MediaQueryListEvent | MediaQueryList) => setValue(x.matches);
    mql.addListener(handler);
    return () => mql.removeListener(handler);
  }, []);

  return value;
}

type ThemeUnion = 'light' | 'dark';
/**
 * Hook gets theme based on user preference, and also OS/Browser preference.
 * @returns 'light' | 'dark' theme name
 */
export function getThemeName(): ThemeUnion {
  const themePreference: ThemeUnion = localStorage.headlampThemePreference;

  if (typeof window.matchMedia !== 'function') {
    return 'light';
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  let themeName: ThemeUnion = 'light';
  if (themePreference) {
    // A selected theme preference takes precedence.
    themeName = themePreference;
  } else {
    if (prefersLight) {
      themeName = 'light';
    } else if (prefersDark) {
      themeName = 'dark';
    }
  }
  if (!['light', 'dark'].includes(themeName)) {
    themeName = 'light';
  }

  return themeName;
}

export function setTheme(themeName: string) {
  if (!Object.keys(themesConf).includes(themeName)) {
    console.warn(`Invalid theme name: "${themeName}". Skipping setting theme.`);
    return;
  }
  localStorage.headlampThemePreference = themeName;
}

export function createTheme(options?: ThemeOptions | 'light' | 'dark', ...args: object[]): Theme {
  if (typeof options === 'string') {
    if (options === 'dark') {
      return createMuiTheme(darkTheme, ...args);
    }
    return createMuiTheme(lightTheme, ...args);
  }
  return createMuiTheme(deepmerge(lightTheme, options), ...args);
}

// This function is not to be exported to plugins. So they have to go through Redux.
export function addTheme(themeName: string, theme: Theme) {
  themesConf[themeName] = theme;
}

// This function is not to be exported to plugins. So they have to go through Redux.
export function removeTheme(themeName: string) {
  delete themesConf[themeName];
}

export function getTheme(themeName: string): Theme {
  return themesConf[themeName];
}
