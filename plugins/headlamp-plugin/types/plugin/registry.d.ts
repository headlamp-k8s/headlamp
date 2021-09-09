/// <reference types="react" />
import { Route } from '../lib/router';

interface SectionFuncProps {
    title: string;
    component: (props: { resource: any }) => JSX.Element | null;
}
export type sectionFunc = (resource: any) => SectionFuncProps | null | undefined;

export default class Registry {
    registerSidebarItem(parentName: string, itemName: string, itemLabel: string, url: string, opts?: {
        useClusterURL: boolean;
    }): void;
    registerRoute(routeSpec: Route): void;
    registerDetailsViewHeaderAction(actionName: string, actionFunc: (...args: any[]) => JSX.Element | null): void;
    registerAppBarAction(actionName: string, actionFunc: (...args: any[]) => JSX.Element | null): void;
    registerDetailsViewSection(sectionName: string, sectionFunc: sectionFunc): void;
}
