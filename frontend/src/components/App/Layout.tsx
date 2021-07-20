import { Box } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import React from 'react';
import { ClusterTitle } from '../cluster/Chooser';
import ActionsNotifier from '../common/ActionsNotifier';
import AlertNotification from '../common/AlertNotification';
import Sidebar, { NavigationTabs } from '../Sidebar';
import { drawerWidth } from '../Sidebar';
// import HeadlampButton from '../Sidebar/HeadlampButton';
import RouteSwitcher from './RouteSwitcher';
import TopBar from './TopBar';

const useStyle = makeStyles(theme => ({
  root: {
    background: theme.palette.background.default,
    paddingLeft: (props: { isSidebarOpen: boolean }) =>
      props.isSidebarOpen ? `${drawerWidth}px` : '0px',
    marginLeft: drawerWidth,
    '& > *': {
      color: theme.palette.text.primary,
    },
  },
  content: {
    flexGrow: 1,
  },
  toolbar: theme.mixins.toolbar,
  // importing visuallyHidden has typing issues at time of writing.
  // import { visuallyHidden } from '@material-ui/utils';
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: '1px',
  },
}));

export interface LayoutProps {
  /** If the sidebar is fully expanded open or shrunk. */
  isSidebarOpen: boolean;
}

export default function Layout({ isSidebarOpen }: LayoutProps) {
  const classes = useStyle({ isSidebarOpen });

  return (
    <>
      <Link href="#main" className={classes.visuallyHidden}>
        Skip to main content
      </Link>
      <Box display="flex">
        <CssBaseline />

        <AppBar
          position="fixed"
          className={classes.root}
          elevation={1}
          component="nav"
          aria-label="Appbar Tools"
        >
          <Toolbar>
            {/*<HeadlampButton open={false} onToggleOpen={() => {}} />*/}
            <div style={{ flex: '1 0 0' }} />
            <ClusterTitle />
            <div style={{ flex: '1 0 0' }} />
            <TopBar />
          </Toolbar>
        </AppBar>
        <Sidebar />
        <main id="main" className={classes.content}>
          <AlertNotification />
          <Box p={3}>
            <div className={classes.toolbar} />
            <Container maxWidth="lg">
              <NavigationTabs />
              <RouteSwitcher />
            </Container>
          </Box>
        </main>
        <ActionsNotifier />
      </Box>
    </>
  );
}
