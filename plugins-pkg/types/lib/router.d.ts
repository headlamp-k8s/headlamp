/// <reference types="react" />
export interface Route {
    path: string;
    exact?: boolean;
    name?: string;
    noCluster?: boolean;
    noAuthRequired?: boolean;
    sidebar: string | null;
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
