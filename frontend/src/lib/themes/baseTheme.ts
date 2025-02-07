import { green, grey, orange, pink, red } from '@mui/material/colors';
import { createTheme, ThemeOptions } from '@mui/material/styles';

export const BaseThemeOptions: ThemeOptions = {
  // @todo: Remove this once we have tested and fixed the theme for the new breakpoints.
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  palette: {
    primary: {
      contrastText: '#fff',
      main: '#0078d4',
    },
    secondary: {
      light: pink.A200,
      main: pink.A400,
      dark: pink.A700,
    },
    primaryColor: '#000',
    success: {
      light: '#f8fff0',
      main: green['800'],
      ...green,
    },
    warning: {
      main: 'rgb(196, 69, 0)', // orange
      light: orange['50'],
      ...orange,
    },
    squareButton: {
      background: '#f5f5f5',
    },
    sidebarLink: {
      color: '#e7e7e7',
      main: {
        selected: {
          color: '#000',
          backgroundColor: '#fff200',
        },
        color: '#fff',
      },
      selected: {
        color: '#fff099',
        backgroundColor: 'unset',
      },
      hover: {
        color: '#000',
        backgroundColor: '#3B3A39',
      },
    },
    clusterChooser: {
      button: {
        color: '#fff',
        background: '#000',

        hover: {
          background: '#605e5c',
        },
      },
    },
    sidebarButtonInLinkArea: {
      color: '#fff',
      primary: {
        background: '#605e5c',
      },
      hover: {
        background: '#3B3A39',
      },
    },
    home: {
      status: {
        error: red['800'],
        success: '#107C10',
        warning: orange['50'],
        unknown: grey['800'],
      },
    },
    sidebarBg: '#242424',
    error: {
      main: red['800'],
      light: red['50'],
    },
    resourceToolTip: {
      color: 'rgba(0, 0, 0, 0.87)',
    },
    normalEventBg: '#F0F0F0',
    chartStyles: {
      defaultFillColor: grey['300'],
      labelColor: '#000',
    },
    metadataBgColor: '#f3f2f1',
    headerStyle: {
      normal: {
        fontSize: '1.8rem',
        fontWeight: '700',
      },
      main: {
        fontSize: '1.87rem',
        fontWeight: '700',
      },
      subsection: {
        fontSize: '1.85rem',
        fontWeight: '700',
      },
      label: {
        fontSize: '1.6rem',
        paddingTop: '1rem',
      },
    },
    tables: {
      head: {
        background: '#faf9f8',
        color: '#242424',
        borderColor: 'rgba(0,0,0,0.12)',
      },
      body: {
        background: '#fff',
      },
    },
    notificationBorderColor: 'rgba(0,0,0,0.12)',
    background: {
      default: '#fff',
    },
  },
  typography: {
    fontFamily: ['Overpass', 'sans-serif'].join(', '),
    h1: {
      fontWeight: 700,
      fontSize: '1.87rem',
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiSelect: {
      defaultProps: {
        variant: 'standard' as 'filled' | 'outlined' | 'standard',
      },
    },
    MuiFormControl: {
      defaultProps: {
        variant: 'standard' as 'filled' | 'outlined' | 'standard',
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'standard' as 'filled' | 'outlined' | 'standard',
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '1.3em',
          color: '#fff',
          backgroundColor: '#000',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#f5f5f5',
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: 'medium' as 'medium' | 'large' | 'small' | undefined,
      },
      styleOverrides: {
        colorPrimary: {
          color: '#000',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#0078D4',
        },
      },
      defaultProps: {
        underline: 'hover' as 'always' | 'hover' | 'none',
      },
    },
  },
};

const baseTheme = createTheme(BaseThemeOptions);

export default baseTheme;
