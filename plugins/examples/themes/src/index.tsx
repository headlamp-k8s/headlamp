import { registerTheme } from '@kinvolk/headlamp-plugin/lib';
import { createTheme } from '@kinvolk/headlamp-plugin/lib/Theme';

const orangeTheme = createTheme({
  palette: {
    primary: {
      main: '#ff9800',
    },
    secondary: {
      main: '#f44336',
    },
    sidebarLink: {
      color: '#e7e7e7',
      main: {
        selected: {
          color: '#000',
          backgroundColor: '#ffa500',
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
  },
});

registerTheme('Orange', orangeTheme);

const funkyTheme = createTheme({
  palette: {
    primary: {
      main: '#8e44ad', // Purple
    },
    secondary: {
      main: '#3498db', // Blue
    },
    sidebarLink: {
      color: '#e7e7e7',
      main: {
        selected: {
          color: '#000',
          backgroundColor: '#e74c3c', // Red
        },
        color: '#fff',
      },
      selected: {
        color: '#fff099',
        backgroundColor: '#2ecc71', // Green
      },
      hover: {
        color: '#000',
        backgroundColor: '#f1c40f', // Yellow
      },
    },
  },
});

registerTheme('Funky', funkyTheme);
