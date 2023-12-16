import { configureStore } from '@reduxjs/toolkit';
import { Route } from '../lib/router';
import routesReducer, { setRoute, setRouteFilter } from './routesSlice';

describe('routesSlice', () => {
  let store = configureStore({
    reducer: {
      routes: routesReducer,
    },
  });

  beforeEach(() => {
    store = configureStore({
      reducer: {
        routes: routesReducer,
      },
    });
  });

  describe('setRoute', () => {
    it('should add a new route to the state', () => {
      const testRoute: Route = {
        path: '/test',
        component: () => <div>Test</div>,
        sidebar: null,
      };
      store.dispatch(setRoute(testRoute));

      const savedRoute = store.getState().routes.routes['/test'];
      expect(savedRoute).toEqual(testRoute);
    });

    it('should update an existing route in the state', () => {
      const initialRoute: Route = {
        path: '/test',
        component: () => <div>Initial</div>,
        sidebar: null,
      };
      const updatedRoute: Route = {
        path: '/test',
        component: () => <div>Updated</div>,
        sidebar: null,
      };

      store.dispatch(setRoute(initialRoute));
      store.dispatch(setRoute(updatedRoute));

      const savedRoute = store.getState().routes.routes['/test'];
      expect(savedRoute).toEqual(updatedRoute);
    });
  });

  describe('setRouteFilter', () => {
    it('should add a new route filter to the state', () => {
      const testFilter = (route: Route) => route;
      store.dispatch(setRouteFilter(testFilter));

      const savedFilters = store.getState().routes.routeFilters;
      expect(savedFilters).toContain(testFilter);
    });
  });
});
