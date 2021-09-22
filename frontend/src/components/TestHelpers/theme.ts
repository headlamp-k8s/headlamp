import { createTheme } from '@material-ui/core';
import { green, grey, orange, red } from '@material-ui/core/colors';

const commonRules = {
  palette: {
    primary: {
      contrastText: '#fff',
      main: '#2774b3',
    },
    primaryColor: '#000',
    success: {
      light: green['50'],
      main: green['800'],
      ...green,
    },
    warning: {
      main: 'rgb(196, 69, 0)', // orange
      light: orange['50'],
      ...orange,
    },
    sidebarLink: {
      main: grey['500'],
      selectedBg: grey['800'],
    },
    error: {
      main: red['800'],
      light: red['50'],
    },
    resourceToolTip: {
      color: 'rgba(0, 0, 0, 0.87)',
    },
    sidebarBg: '#000',
    normalEventBg: '#F0F0F0',
    chartStyles: {
      defaultFillColor: grey['300'],
      labelColor: '#000',
    },
    metadataBgColor: grey['300'],
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
    fontFamily: ['Overpass', 'sans-serif'].join(', '),
    h1: {
      fontWeight: 700,
      fontSize: '1.87rem',
    },
  },
  shape: {
    borderRadius: 0,
  },
};

export const theme = createTheme(commonRules);
