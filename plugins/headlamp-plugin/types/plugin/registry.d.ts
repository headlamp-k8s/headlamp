/// <reference types="react" />
import { Route } from '../lib/router';
export default class Registry {
    registerSidebarItem(parentName: string, itemName: string, itemLabel: string, url: string, opts?: {
        useClusterURL: boolean;
    }): void;
    registerRoute(routeSpec: Route): void;
    registerDetailsViewHeaderAction(actionName: string, actionFunc: (...args: any[]) => JSX.Element | null): void;
    registerAppBarAction(actionName: string, actionFunc: (...args: any[]) => JSX.Element | null): void;
}
