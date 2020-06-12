import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import orange from '@material-ui/core/colors/orange';
import red from '@material-ui/core/colors/red';
import { createMuiTheme, Theme } from '@material-ui/core/styles';

declare module '@material-ui/core/styles/createPalette.d' {
  interface Palette {
    success: object;
    sidebarLink: {
      [propName: string]: string;
    };
    [propName: string]: any;
  }
  interface PaletteOptions {
    success: object;
    sidebarLink: {
      [propName: string]: string;
    };
    [propName: string]: any;
  }
}

const commonRules = {
  palette: {
    primary: {
      contrastText: '#fff',
      main: '#3DA3F5',
    },
    success: {
      light: green['50'],
      main: green['500'],
      ...green
    },
    warning: {
      main: orange['500'],
      light: orange['50'],
      ...orange
    },
    sidebarLink: {
      main: grey['500'],
      selectedBg: grey['800'],
    },
    error: {
      main: red['500'],
      light: red['50'],
    },
    sidebarBg: '#000',
    normalEventBg: '#F0F0F0',
    headerStyle: {
      normal: {
        '& h6': {
          fontSize: '1.1rem',
        },
      },
      main: {
        '& h6': {
          fontSize: '1.87rem',
        },
        minHeight: '64px',
      },
      subsection: {
        fontSize: '1.2rem',
      },
    },
    tables: {
      headerText: '#474747',
    },
  },
  typography: {
    fontFamily: ['Overpass', 'sans-serif'].join(', ')
  },
  shape: {
    borderRadius: 0,
  },
};

const lightTheme = createMuiTheme(commonRules);
const darkTheme = createMuiTheme({
  ...commonRules,
  palette: {
    ...commonRules.palette,
    tables: {
      headerText: '#9e9e9e',
    },
    type: 'dark',
  },
});

export interface ThemesConf {
  [themeName: string]: Theme;
}

const themesConf: ThemesConf = {
  'light': lightTheme,
  'dark': darkTheme,
};

export default themesConf;

export function getTheme(): string {
  let theme: string = localStorage.theme;

  if (!theme) {
    theme = 'light';
    setTheme(theme);
  }

  return theme;
}

export function setTheme(themeName: string) {
  localStorage.theme = themeName;
}
