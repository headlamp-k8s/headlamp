import React from 'react';
import themesConf from '@kinvolk/headlamp-plugin/lib/lib/themes';
import { ThemeProvider } from '@mui/material/styles';
import StylesProvider from '@mui/styles/StylesProvider';

const darkTheme = themesConf['dark'];
const lightTheme = themesConf['light'];

const withThemeProvider = (Story, context) => {
  const backgroundColor = context.globals.backgrounds ? context.globals.backgrounds.value : 'light';
  const theme = backgroundColor !== 'dark' ? lightTheme : darkTheme;

  const ourThemeProvider = (
    <ThemeProvider theme={theme}>
      <Story {...context} />
    </ThemeProvider>
  );
  if (process.env.NODE_ENV !== 'test') {
    return ourThemeProvider;
  } else {
    const generateClassName = (rule, styleSheet) =>
      `${styleSheet?.options.classNamePrefix}-${rule.key}`;

    return (
      <StylesProvider generateClassName={generateClassName}>{ourThemeProvider}</StylesProvider>
    );
  }
};
// export const decorators = [withThemeProvider, mswDecorator];
// export const decorators = [mswDecorator];
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
