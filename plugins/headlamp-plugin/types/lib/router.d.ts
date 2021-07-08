/// <reference types="react" />
/**
 * @see {@link https://github.com/kinvolk/headlamp/blob/main/frontend/src/lib/router.tsx Route examples}
 */
export interface Route {
    /** Any valid URL path or array of paths that path-to-regexp@^1.7.0 understands. */
    path: string;
    /** When true, will only match if the path matches the location.pathname exactly. */
    exact?: boolean;
    /** Human readable name. Capitalized and short. */
    name?: string;
    /** In case this route does *not* need a cluster prefix and context. */
    noCluster?: boolean;
    /** This route does not require Authentication. */
    noAuthRequired?: boolean;
    /** The sidebar group this Route should be in, or null if it is in no group. */
    sidebar: string | null;
    /** Shown component for this route. */
    component: () => JSX.Element;
}
export declare const ROUTES: {
    [routeName: string]: Route;
};
export declare function getRoute(routeName: string): Route;
export declare function getRoutePath(route: Route): string;
export interface RouteURLProps {
    cluster?: string;
    [prop: string]: any;
}
export declare function createRouteURL(routeName: string, params?: RouteURLProps): string;
