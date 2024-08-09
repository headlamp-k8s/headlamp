import React from 'react';
import themesConf from '../src/lib/themes';
import { ThemeProvider } from '@mui/material/styles';
import { initialize, mswDecorator } from 'msw-storybook-addon';
import { http, HttpResponse } from 'msw';
import '../src/index.css';

// https://github.com/mswjs/msw-storybook-addon
initialize();

const withThemeProvider = (Story, context) => {
  const theme = themesConf[context.globals.backgrounds?.value === '#1f1f1f' ? 'dark' : 'light'];

  const ourThemeProvider = (
    <ThemeProvider theme={theme}>
      <Story {...context} />
    </ThemeProvider>
  );
  return ourThemeProvider;
};
export const decorators = [withThemeProvider, mswDecorator];

export const parameters = {
  backgrounds: {
    values: [
      { name: 'light', value: '#FFF' },
      { name: 'dark', value: '#1f1f1f' },
    ],
  },

  // https://github.com/mswjs/msw-storybook-addon#composing-request-handlers
  msw: {
    handlers: [
      http.get('https://api.iconify.design/mdi.json', () => HttpResponse.json({})),
      http.get('http://localhost/api/v1/namespaces', () => HttpResponse.json({})),
      http.get('http://localhost/api/v1/events', () => HttpResponse.json({})),
      http.post('http://localhost/apis/authorization.k8s.io/v1/selfsubjectaccessreviews', () =>
        HttpResponse.json({ status: 200 })
      ),
      http.get('http://localhost:4466/api/v1/namespaces', () => HttpResponse.json({})),
      http.get('http://localhost:4466/api/v1/events', () => HttpResponse.json({})),
      http.post('http://localhost:4466/apis/authorization.k8s.io/v1/selfsubjectaccessreviews', () =>
        HttpResponse.json({ status: 200 })
      ),
    ],
  },
};
export const tags = ['autodocs', 'autodocs'];
