import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Redirect, Route, RouteProps, Switch, useHistory } from 'react-router-dom';
import { getToken } from '../../lib/auth';
import { useClustersConf } from '../../lib/k8s';
import {
  createRouteURL,
  getDefaultRoutes,
  getRoutePath,
  getRouteUseClusterURL,
  NotFoundRoute,
  Route as RouteType,
} from '../../lib/router';
import { getCluster } from '../../lib/util';
import { setHideAppBar } from '../../redux/actions/actions';
import { useTypedSelector } from '../../redux/reducers/reducers';
import { useSidebarItem } from '../Sidebar';

export default function RouteSwitcher() {
  // The NotFoundRoute always has to be evaluated in the last place.
  const routes = useTypedSelector(state => state.ui.routes);
  const routeFilters = useTypedSelector(state => state.ui.routeFilters);
  const defaultRoutes = Object.values(getDefaultRoutes()).concat(NotFoundRoute);
  const filteredRoutes = Object.values(routes)
    .concat(defaultRoutes)
    .filter(
      route =>
        !(
          routeFilters.length > 0 &&
          routeFilters.filter(f => f(route)).length !== routeFilters.length
        )
    );

  return (
    <Switch>
      {filteredRoutes.map((route, index) =>
        route.name === 'OidcAuth' ? (
          <Route path={route.path} component={() => <RouteComponent route={route} />} key={index} />
        ) : (
          <AuthRoute
            path={getRoutePath(route)}
            sidebar={route.sidebar}
            requiresAuth={!route.noAuthRequired}
            requiresCluster={getRouteUseClusterURL(route)}
            exact={!!route.exact}
            children={<RouteComponent route={route} />}
            key={index}
          />
        )
      )}
    </Switch>
  );
}

function RouteComponent({ route }: { route: RouteType }) {
  const { t } = useTranslation('frequent');
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(setHideAppBar(route.hideAppBar));
  }, [route.hideAppBar]);

  return (
    <PageTitle title={t(route.name ? route.name : route.sidebar ? route.sidebar : '')}>
      <route.component />
    </PageTitle>
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

const PreviousRouteContext = React.createContext<number>(0);

export function PreviousRouteProvider({ children }: React.PropsWithChildren<{}>) {
  const history = useHistory();
  const [locationInfo, setLocationInfo] = React.useState<number>(0);

  React.useEffect(() => {
    history.listen((location, action) => {
      if (action === 'PUSH') {
        setLocationInfo(levels => levels + 1);
      } else if (action === 'POP') {
        setLocationInfo(levels => levels - 1);
      }
    });
  }, []);

  return (
    <PreviousRouteContext.Provider value={locationInfo}>{children}</PreviousRouteContext.Provider>
  );
}

export function useHasPreviousRoute() {
  const routeLevels = React.useContext(PreviousRouteContext);
  return routeLevels > 1;
}
