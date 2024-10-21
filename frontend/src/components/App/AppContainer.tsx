import { GlobalStyles } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import React, { useEffect } from 'react';
import { BrowserRouter, HashRouter, useHistory, useLocation } from 'react-router-dom';
import helpers from '../../helpers';
import Plugins from '../../plugin/Plugins';
import ReleaseNotes from '../common/ReleaseNotes/ReleaseNotes';
import Layout from './Layout';
import { PreviousRouteProvider } from './RouteSwitcher';

const RedirectHandler = () => {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const redirectPath = searchParams.get('to');
    if (redirectPath) {
      history.replace(redirectPath);
    }
  }, [history, location]);

  return null;
};

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
          <RedirectHandler />
          <Plugins />
          <Layout />
        </PreviousRouteProvider>
      </Router>
      <ReleaseNotes />
    </SnackbarProvider>
  );
}
