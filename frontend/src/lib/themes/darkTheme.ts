import { green, orange, red } from '@mui/material/colors';
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { BaseThemeOptions } from './baseTheme';

export const DarkThemeOptions: ThemeOptions = {
  palette: {
    tables: {
      head: {
        background: '#000',
        color: '#aeaeae',
        borderColor: 'rgba(255,255,255,0.12)',
      },
      body: {
        background: '#1B1A19',
      },
    },
    primary: {
      contrastText: '#000',
      main: '#4B99EE',
    },
    squareButton: {
      background: '#424242',
    },
    primaryColor: '#fff',
    chartStyles: {
      defaultFillColor: 'rgba(20, 20, 20, 0.1)',
      fillColor: '#929191',
      labelColor: '#fff',
    },
    success: {
      light: green['800'],
      main: green['50'],
      ...green,
    },
    warning: {
      main: 'rgb(255 181 104)', // orange
      light: 'rgba(255, 152, 0, 0.15)',
      ...orange,
    },
    error: {
      main: red['800'],
      light: red['300'],
    },
    home: {
      status: {
        error: '#E37D80',
        success: '#54B054',
        warning: '#FEEE66',
        unknown: '#D6D6D6',
      },
    },
    normalEventBg: '#333333',
    metadataBgColor: '#333',
    resourceToolTip: {
      color: 'rgba(255, 255, 255, 0.87)',
    },
    clusterChooser: {
      button: {
        color: '#fff',
        background: '#605e5c',

        hover: {
          background: '#3B3A39',
        },
      },
    },
    sidebarLink: {
      selected: {
        color: '#FFF200',
        backgroundColor: 'unset',
      },
    },
    sidebarBg: '#000',
    notificationBorderColor: 'rgba(255,255,255,0.12)',
    mode: 'dark',
    background: {
      default: '#1f1f1f',
      paper: '#1f1f1f',
    },
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#000',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          colorPrimary: {
            backgroundColor: '#000',
          },
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: 'medium' as 'medium' | 'large' | 'small' | undefined,
      },
      styleOverrides: {
        colorPrimary: {
          color: '#fff',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#6CB6F2',
        },
      },
      defaultProps: {
        underline: 'hover' as 'always' | 'hover' | 'none',
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          colorPrimary: {
            '&&.Mui-checked': {
              color: '#4b99ee',
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        textColorPrimary: {
          '&&.Mui-selected': {
            color: '#fff',
            borderBottomColor: '#fff',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          indicator: {
            backgroundColor: '#fff',
          },
        },
      },
    },
  },
};

const darkTheme = createTheme(BaseThemeOptions);

export default darkTheme;
