import React from 'react';
import { Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import { getToken } from '../../lib/auth';
import { useClustersConf } from '../../lib/k8s';
import { createRouteURL, getRoutePath, ROUTES } from '../../lib/router';
import { getCluster } from '../../lib/util';
import { useTypedSelector } from '../../redux/reducers/reducers';
import { useSidebarItem } from '../Sidebar';

export default function RouteSwitcher() {
  const routes = useTypedSelector(state => state.ui.routes);

  return (
    <Switch>
      {Object.values(ROUTES)
        .concat(Object.values(routes))
        .map((route, index) =>
          route.name === 'OidcAuth' ? (
            <Route
              path={route.path}
              component={() => (
                <PageTitle title={route.name ? route.name : route.sidebar}>
                  <route.component />
                </PageTitle>
              )}
              key={index}
            />
          ) : (
            <AuthRoute
              key={index}
              path={getRoutePath(route)}
              sidebar={route.sidebar}
              requiresAuth={!route.noAuthRequired}
              requiresCluster={!route.noCluster}
              exact={!!route.exact}
              children={
                <PageTitle title={route.name ? route.name : route.sidebar}>
                  <route.component />
                </PageTitle>
              }
            />
          )
        )}
    </Switch>
  );
}

function PageTitle({
  title,
  children,
}: {
  title: string | null | undefined;
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    document.title = title || '';
  }, [title]);

  return <>{children}</>;
}

interface AuthRouteProps {
  children: React.ReactNode | JSX.Element;
  sidebar: string | null;
  requiresAuth: boolean;
  requiresCluster: boolean;
  [otherProps: string]: any;
}

function AuthRoute(props: AuthRouteProps) {
  const { children, sidebar, requiresAuth = true, requiresCluster = true, ...other } = props;
  const clusters = useClustersConf();
  const redirectRoute = getCluster() ? 'login' : 'chooser';

  useSidebarItem(sidebar);

  function getRenderer({ location }: RouteProps) {
    if (!requiresAuth) {
      return children;
    }

    if (requiresCluster) {
      const clusterName = getCluster();
      if (!!clusterName) {
        const cluster = clusters ? clusters[clusterName] : undefined;
        const requiresToken = cluster?.useToken === undefined || cluster?.useToken;
        if (!!getToken(clusterName) || !requiresToken) {
          return children;
        }
      }
    }

    return (
      <Redirect
        to={{
          pathname: createRouteURL(redirectRoute),
          state: { from: location },
        }}
      />
    );
  }

  // If no auth is required for the view, or the token is set up, then
  // render the assigned component. Otherwise redirect to the login route.
  return <Route {...other} render={getRenderer} />;
}
