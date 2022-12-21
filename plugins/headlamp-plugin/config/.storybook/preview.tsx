import React from 'react';
import themesConf from '@kinvolk/headlamp-plugin/dist/lib/themes';
import { ThemeProvider, StylesProvider } from '@material-ui/core/styles';
// import { initialize, mswDecorator } from 'msw-storybook-addon';
// import { rest } from 'msw'

// https://github.com/mswjs/msw-storybook-addon
// initialize();

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

  // // https://github.com/mswjs/msw-storybook-addon#composing-request-handlers
  // msw: {
  //   handlers: [
  //     rest.get('https://api.iconify.design/mdi.json', (_req, res, ctx) => {
  //       return res(ctx.json({}));
  //     }),
  //     rest.get('http://localhost/api/v1/namespaces', (_req, res, ctx) => {
  //       return res(ctx.json({}));
  //     }),
  //     rest.get('http://localhost/api/v1/events', (_req, res, ctx) => {
  //       return res(ctx.json({}));
  //     }),
  //     rest.post('http://localhost/apis/authorization.k8s.io/v1/selfsubjectaccessreviews', (_req, res, ctx) => {
  //       return res(ctx.json({status: 200}));
  //     }),
  //   ]
  // },
};
