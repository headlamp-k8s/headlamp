import { SnackbarProvider } from 'notistack';
import React from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import helpers from '../../helpers';
import { setWhetherSidebarOpen } from '../../redux/actions/actions';
import { useTypedSelector } from '../../redux/reducers/reducers';
import ReleaseNotes from '../common/ReleaseNotes/ReleaseNotes';
import Layout from './Layout';

export default function AppContainer() {
  const dispatch = useDispatch();
  const isSidebarOpen = useTypedSelector(state => state.ui.sidebar.isSidebarOpen);
  const Router = ({ children }: React.PropsWithChildren<{}>) =>
    helpers.isElectron() ? (
      <HashRouter>{children}</HashRouter>
    ) : (
      <BrowserRouter basename={helpers.getBaseUrl()}>{children}</BrowserRouter>
    );

  localStorage.setItem('sidebar', JSON.stringify({ shrink: isSidebarOpen }));

  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Router>
        <Layout
          isSidebarOpen={isSidebarOpen}
          onToggleOpen={() => {
            dispatch(setWhetherSidebarOpen(!isSidebarOpen));
          }}
        />
      </Router>
      <ReleaseNotes />
    </SnackbarProvider>
  );
}
