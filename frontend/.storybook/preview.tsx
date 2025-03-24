import { ThemeProvider } from '@mui/material/styles';
import { initialize, mswLoader } from 'msw-storybook-addon';
import '../src/index.css';
import { Title, Subtitle, Description, Primary, Controls } from '@storybook/blocks';
import { baseMocks } from './baseMocks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../src/App';
import { darkTheme, lightTheme, useAppThemes } from '../src/components/App/themeSlice';
import { createMuiTheme } from '../src/lib/themes';

// App import will load the whole app dependency tree
// And assigning it to a value will make sure it's not tree-shaken and removed
const DontDeleteMe = App;

// https://github.com/mswjs/msw-storybook-addon
initialize({
  onUnhandledRequest: 'warn',
  waitUntilReady: true,
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: 'always',
      staleTime: 0,
      retry: false,
      gcTime: 0,
    },
  },
});

const withThemeProvider = (Story: any, context: any) => {
  const theme = context.globals.backgrounds?.value === '#1f1f1f' ? darkTheme : lightTheme;

  const ourThemeProvider = (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={createMuiTheme(theme)}>
        <Story {...context} />
      </ThemeProvider>
    </QueryClientProvider>
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
