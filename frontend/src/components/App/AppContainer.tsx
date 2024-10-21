import { GlobalStyles } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import helpers, { setBackendToken } from '../../helpers';
import Plugins from '../../plugin/Plugins';
import ReleaseNotes from '../common/ReleaseNotes/ReleaseNotes';
import Layout from './Layout';
import { PreviousRouteProvider } from './RouteSwitcher';

window.desktopApi?.send('request-backend-token');
window.desktopApi?.receive('backend-token', (token: string) => {
  setBackendToken(token);
});

export default function AppContainer() {
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