import { GlobalStyles } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import helpers, { setBackendToken as setGlobalBackendToken } from '../../helpers';
import Plugins from '../../plugin/Plugins';
import ReleaseNotes from '../common/ReleaseNotes/ReleaseNotes';
import Layout from './Layout';
import { PreviousRouteProvider } from './RouteSwitcher';

export default function AppContainer() {
  const [, setBackendToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    console.log('[AppContainer] Setting up backendToken listener...');
    window.desktopApi?.receive('backendToken', (token: string) => {
      console.log('[AppContainer] Received backendToken:', token);
      setBackendToken(token);
      setGlobalBackendToken(token);
    });
  }, []);

  const Router = ({ children }: React.PropsWithChildren<{}>) =>
    helpers.isElectron() ? (
      <HashRouter>{children}</HashRouter>
    ) : (
      <BrowserRouter basename={helpers.getBaseUrl()}>{children}</BrowserRouter>
    );

  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <GlobalStyles
        styles={{
          ':root': {
            '@media (prefers-reduced-motion: reduce)': {
              '& *': {
                animationDuration: '0.01ms !important',
                animationIterationCount: '1 !important',
                transitionDuration: '0.01ms !important',
                scrollBehavior: 'auto !important',
              },
            },
          },
        }}
      />
      <Router>
        <PreviousRouteProvider>
          <Plugins />
          <Layout />
        </PreviousRouteProvider>
      </Router>
      <ReleaseNotes />
    </SnackbarProvider>
  );
}
