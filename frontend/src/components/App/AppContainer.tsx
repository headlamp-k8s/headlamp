import { SnackbarProvider } from 'notistack';
import React from 'react';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import helpers from '../../helpers';
import ReleaseNotes from '../common/ReleaseNotes/ReleaseNotes';
import Layout from './Layout';
import { PreviousRouteProvider } from './RouteSwitcher';

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
      <Router>
        <PreviousRouteProvider>
          <Layout />
        </PreviousRouteProvider>
      </Router>
      <ReleaseNotes />
    </SnackbarProvider>
  );
}
