import React from 'react';
import themesConf from '../src/lib/themes';
import { ThemeProvider } from '@material-ui/core/styles';

const darkTheme = themesConf['dark'];
const lightTheme = themesConf['light'];

const withThemeProvider = (Story, context) => {
  const backgroundColor = context.globals.backgrounds
    ? context.globals.backgrounds.value
    : 'light';
  const theme = backgroundColor !== 'dark' ? lightTheme : darkTheme;
  return (
    <ThemeProvider theme={theme}>
      <Story {...context} />
    </ThemeProvider>
  );
};
export const decorators = [withThemeProvider];

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'circlehollow',
      items: ['light', 'dark'],
    },
  },
};

export const parameters = {
  backgrounds: {
    values: [
      { name: 'light', value: 'light' },
      { name: 'dark', value: 'dark' },
    ],
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
};
