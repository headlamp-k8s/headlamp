import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Route } from '../lib/router';

export interface RoutesState {
  /**
   * The routes in the application. Keyed by the route path, value is the route.
   */
  routes: { [path: string]: Route };
  /**
   * The route filters in the application. That is remove routes from routes.
   */
  routeFilters: ((route: Route) => Route | null)[];
}

const initialState: RoutesState = {
  routes: {},
  routeFilters: [],
};

const routesSlice = createSlice({
  name: 'routes',
  initialState,
  reducers: {
    /**
     * Adds or updates a route in the state.
     */
    setRoute(state, action: PayloadAction<Route>) {
      state.routes[action.payload.path] = action.payload;
    },

    /**
     * Adds a route filter function to the routeFilters array in the state.
     *
     * The filter functions can be used elsewhere in the application to filter
     * routes based on certain conditions.
     */
    setRouteFilter(state, action: PayloadAction<(route: Route) => Route | null>) {
      state.routeFilters.push(action.payload);
    },
  },
});

export const { setRoute, setRouteFilter } = routesSlice.actions;

export { routesSlice };
export default routesSlice.reducer;
