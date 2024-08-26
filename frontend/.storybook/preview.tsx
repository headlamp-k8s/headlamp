import themesConf from '../src/lib/themes';
import { ThemeProvider } from '@mui/material/styles';
import { initialize, mswLoader } from 'msw-storybook-addon';
import '../src/index.css';
import { Title, Subtitle, Description, Primary, Controls } from '@storybook/blocks';
import { baseMocks } from './baseMocks';

// https://github.com/mswjs/msw-storybook-addon
initialize({
  onUnhandledRequest: 'warn',
  waitUntilReady: true,
});

const withThemeProvider = (Story: any, context: any) => {
  const theme = themesConf[context.globals.backgrounds?.value === '#1f1f1f' ? 'dark' : 'light'];

  const ourThemeProvider = (
    <ThemeProvider theme={theme}>
      <Story {...context} />
    </ThemeProvider>
  );
  return ourThemeProvider;
};
export const decorators = [withThemeProvider];

export const parameters = {
  backgrounds: {
    values: [
      { name: 'light', value: '#FFF' },
      { name: 'dark', value: '#1f1f1f' },
    ],
  },

  docs: {
    toc: { disable: true },
    // Customize docs page to exclude display of all stories
    // Becasue it would cause stories override each others' mocks
    page: () => (
      <>
        <Title />
        <Subtitle />
        <Description />
        <Primary />
        <Controls />
      </>
    ),
  },

  // https://github.com/mswjs/msw-storybook-addon#composing-request-handlers
  msw: {
    handlers: {
      /**
       * If you wan't to override or disable them in a particular story
       * set base to null in msw configuration
       *
       * parameters: {
       *   msw: {
       *     handlers: {
       *       base: null,
       *       story: [yourMocks]
       *     }
       *   }
       * }
       */
      base: baseMocks,
    },
  },
};

export const loaders = [mswLoader];

export const tags = ['autodocs'];
