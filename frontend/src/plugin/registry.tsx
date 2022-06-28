import React from 'react';
import { ClusterChooserProps, ClusterChooserType } from '../components/cluster/ClusterChooser';
import { SidebarEntryProps } from '../components/Sidebar';
import { AppLogoProps, AppLogoType } from '../components/Sidebar/AppLogo';
import { KubeObject } from '../lib/k8s/cluster';
import { Route } from '../lib/router';
import {
  setAppBarAction,
  setBrandingAppLogoComponent,
  setClusterChooserButtonComponent,
  setDetailsView,
  setDetailsViewHeaderAction,
  setRoute,
  setSidebarItem,
} from '../redux/actions/actions';
import store from '../redux/stores/store';

export interface SectionFuncProps {
  title: string;
  component: (props: { resource: any }) => JSX.Element | null;
}
export type sectionFunc = (resource: KubeObject) => SectionFuncProps | null | undefined;
export type { AppLogoProps, AppLogoType };
export type { ClusterChooserProps, ClusterChooserType };
export type { SidebarEntryProps };

export default class Registry {
  /**
   * Add a SidebarItem.
   *
   * @param parentName - the name of the parent SidebarItem.
   * @param itemName - name of this SidebarItem.
   * @param itemLabel - label to display.
   * @param url - the URL to go to, when this item is followed.
   * @param opts - may have `useClusterURL` (default=true) which indicates whether the URL should
   * have the cluster prefix or not; and `icon` (an iconify string or icon object) that will be used
   * for the sidebar's icon.
   *
   * @example
   *
   * ```tsx
   * import { registerSidebarItem } from '@kinvolk/headlamp-plugin/lib';
   * registerSidebarItem('cluster', 'traces', 'Traces', '/traces');
   * ```
   *
   * @see {@link http://github.com/kinvolk/headlamp/plugins/examples/sidebar/ Sidebar Example}
   */
  registerSidebarItem(
    parentName: string | null,
    itemName: string,
    itemLabel: string,
    url: string,
    opts: Pick<SidebarEntryProps, 'useClusterURL' | 'icon'> = { useClusterURL: true }
  ) {
    const { useClusterURL = true, ...options } = opts;
    store.dispatch(
      setSidebarItem({
        name: itemName,
        label: itemLabel,
        url,
        parent: parentName,
        useClusterURL,
        ...options,
      })
    );
  }

  /**
   * Add a Route for a component.
   *
   * @param routeSpec - details of URL, highlighted sidebar and component to use.
   *
   * @example
   *
   * ```tsx
   * import { registerRoute } from '@kinvolk/headlamp-plugin/lib';
   * // Add a route that will display the given component and select
   * // the "traces" sidebar item.
   * registerRoute({
   *   path: '/traces',
   *   sidebar: 'traces',
   *   component: () => <TraceList />
   * });
   * ```
   *
   * @see {@link https://github.com/kinvolk/headlamp/blob/main/frontend/src/lib/router.tsx Route examples}
   * @see {@link http://github.com/kinvolk/headlamp/plugins/examples/sidebar/ Sidebar Example}
   *
   */
  registerRoute(routeSpec: Route) {
    store.dispatch(setRoute(routeSpec));
  }

  /**
   * Add a component into the details view header.
   *
   * @param actionName - a unique name for it
   * @param actionFunc - a function that returns your component
   *                     with props to pass into it.
   *
   * @example
   *
   * ```tsx
   * import { registerDetailsViewHeaderAction } from '@kinvolk/headlamp-plugin/lib';
   * registerDetailsViewHeaderAction('traces', (props) =>
   *   <TraceIcon {...props} />
   * );
   * ```
   */
  registerDetailsViewHeaderAction(
    actionName: string,
    actionFunc: (...args: any[]) => JSX.Element | null
  ) {
    store.dispatch(setDetailsViewHeaderAction(actionName, actionFunc));
  }

  /**
   * Add a component into the app bar (at the top of the app).
   *
   * @param actionName - a unique name for it
   * @param actionFunc - a function that returns your component
   *
   * @example
   *
   * ```tsx
   * import { registerRoute } from '@kinvolk/headlamp-plugin/lib';
   * registerAppBarAction('monitor', () => <MonitorLink /> );
   * ```
   */
  registerAppBarAction(actionName: string, actionFunc: (...args: any[]) => JSX.Element | null) {
    store.dispatch(setAppBarAction(actionName, actionFunc));
  }

  /**
   * Append the specified title and component to the details view.
   *
   * @param sectionName a unique name for it
   * @param sectionFunc - a function that returns your detail view component with props
   *                      passed into it and the section title
   *
   * @example
   *
   * ```tsx
   * import { registerDetailsViewSection } from '@kinvolk/headlamp-plugin/lib';
   * function myDetailView({resource: KubeObject}) {
   *   return {
   *    title: 'Block I/O Latency',
   *    component: (props) => <BioLatency {...props} resource={resource}/>
   *   }
   * }
   *
   * registerDetailsViewSection("biolatency", myDetailView);
   * ```
   */
  registerDetailsViewSection(sectionName: string, sectionFunc: sectionFunc) {
    store.dispatch(setDetailsView(sectionName, sectionFunc));
  }

  /**
   * Add a logo for Headlamp to use instead of the default one.
   *
   * @param logo is a React Component that takes two required props
   * `logoType` which is a constant string literal that accepts either
   * of the two values `small` or `large` depending on whether
   * the sidebar is in shrink or expanded state so that you can change your logo
   * from small to large and the other optional prop is the `themeName`
   * which is a string with two values 'light' and 'dark' base on which theme is selected.
   *
   * @example
   * ```tsx
   * import { registerAppLogo } from '@kinvolk/headlamp-plugin/lib';
   * registerAppLogo(<p>my logo</p>)
   * ```
   *
   * More complete logo example in plugins/examples/change-logo:
   * @see {@link http://github.com/kinvolk/headlamp/plugins/examples/change-logo/ Change Logo Example}
   *
   */
  registerAppLogo(logo: AppLogoType) {
    store.dispatch(setBrandingAppLogoComponent(logo));
  }

  /**
   * Use a custom cluster chooser button
   *
   * @param component is a React Component that takes one required props ```tsx clickHandler``` which is the
   * action handler that happens when the custom chooser button component click event occurs
   *
   * @example
   * ```tsx
   * import { ClusterChooserProps, registerClusterChooser } from '@kinvolk/headlamp-plugin/lib';
   *
   * function MyClusterChooser(props: ClusterChooserProps) {
   *   return <button onClick={clickHandler}>my chooser</button>;
   * }
   *
   * registerClusterChooser(MyClusterChooser)
   * ```
   *
   * @see {@link http://github.com/kinvolk/headlamp/plugins/examples/cluster-chooser/ Cluster Chooser Example}
   *
   */
  registerClusterChooser(component: React.ComponentType<ClusterChooserProps> | null) {
    store.dispatch(setClusterChooserButtonComponent(component));
  }

  /**
   * @deprecated Please use registerClusterChooser. This will be removed in headlamp-plugin 0.4.11.
   */
  registerClusterChooserComponent(component: React.ComponentType<ClusterChooserProps> | null) {
    console.warn(
      'registerClusterChooserComponent is deprecated. Please use registerClusterChooser.'
    );
    store.dispatch(setClusterChooserButtonComponent(component));
  }
}

/**
 * Add a Sidebar Entry to the menu (on the left side of Headlamp).
 *
 * @example
 *
 * ```tsx
 * import { registerSidebarEntry } from '@kinvolk/headlamp-plugin/lib';
 * registerSidebarEntry({ parent: 'cluster', name: 'traces', label: 'Traces', url: '/traces' });
 *
 * ```
 *
 * @see {@link http://github.com/kinvolk/headlamp/plugins/examples/sidebar/ Sidebar Example}
 */
export function registerSidebarEntry({
  parent,
  name,
  label,
  url,
  useClusterURL = true,
  icon,
}: SidebarEntryProps) {
  store.dispatch(
    setSidebarItem({
      name,
      label,
      url,
      parent,
      useClusterURL,
      icon,
    })
  );
}

/**
 * Add a Route for a component.
 *
 * @param routeSpec - details of URL, highlighted sidebar and component to use.
 *
 * @example
 *
 * ```tsx
 * import { registerRoute } from '@kinvolk/headlamp-plugin/lib';
 * // Add a route that will display the given component and select
 * // the "traces" sidebar item.
 * registerRoute({
 *   path: '/traces',
 *   sidebar: 'traces',
 *   component: () => <TraceList />
 * });
 * ```
 *
 * @see {@link https://github.com/kinvolk/headlamp/blob/main/frontend/src/lib/router.tsx Route examples}
 * @see {@link http://github.com/kinvolk/headlamp/plugins/examples/sidebar/ Sidebar Example}
 *
 */
export function registerRoute(routeSpec: Route) {
  store.dispatch(setRoute(routeSpec));
}

/**
 * Add a component into the details view header.
 *
 * @param actionName - a unique name for it
 * @param actionFunc - a function that returns your component
 *                     with props to pass into it.
 *
 * @example
 *
 * ```tsx
 * import { registerDetailsViewHeaderAction } from '@kinvolk/headlamp-plugin/lib';
 * registerDetailsViewHeaderAction('traces', (props) =>
 *   <TraceIcon {...props} />
 * );
 * ```
 */
export function registerDetailsViewHeaderAction(
  actionName: string,
  actionFunc: (...args: any[]) => JSX.Element | null
) {
  store.dispatch(setDetailsViewHeaderAction(actionName, actionFunc));
}

/**
 * Add a component into the app bar (at the top of the app).
 *
 * @param actionName - a unique name for it
 * @param actionFunc - a function that returns your component
 *
 * @example
 *
 * ```tsx
 * import { registerAppBarAction } from '@kinvolk/headlamp-plugin/lib';
 * registerAppBarAction('monitor', () => <MonitorLink /> );
 * ```
 */
export function registerAppBarAction(
  actionName: string,
  actionFunc: (...args: any[]) => JSX.Element | null
) {
  store.dispatch(setAppBarAction(actionName, actionFunc));
}

/**
 * Append the specified title and component to the details view.
 *
 * @param sectionName a unique name for it
 * @param sectionFunc - a function that returns your detail view component with props
 *                      passed into it and the section title
 *
 * @example
 *
 * ```tsx
 * import { registerDetailsViewSection } from '@kinvolk/headlamp-plugin/lib';
 * function myDetailView({resource: KubeObject}) {
 *   return {
 *    title: 'Block I/O Latency',
 *    component: (props) => <BioLatency {...props} resource={resource}/>
 *   }
 * }
 *
 * registerDetailsViewSection("biolatency", myDetailView);
 * ```
 */
export function registerDetailsViewSection(sectionName: string, sectionFunc: sectionFunc) {
  store.dispatch(setDetailsView(sectionName, sectionFunc));
}

/**
 * Add a logo for Headlamp to use instead of the default one.
 *
 * @param logo is a React Component that takes two required props
 * `logoType` which is a constant string literal that accepts either
 * of the two values `small` or `large` depending on whether
 * the sidebar is in shrink or expanded state so that you can change your logo
 * from small to large and the other optional prop is the `themeName`
 * which is a string with two values 'light' and 'dark' base on which theme is selected.
 *
 * @example
 * ```tsx
 * import { registerAppLogo } from '@kinvolk/headlamp-plugin/lib';
 * registerAppLogo(<p>my logo</p>)
 * ```
 *
 * More complete logo example in plugins/examples/change-logo:
 * @see {@link http://github.com/kinvolk/headlamp/plugins/examples/change-logo/ Change Logo Example}
 *
 */
export function registerAppLogo(logo: AppLogoType) {
  store.dispatch(setBrandingAppLogoComponent(logo));
}

/**
 * Use a custom cluster chooser button
 *
 * @param component is a React Component that takes one required props ```clickHandler``` which is the
 * action handler that happens when the custom chooser button component click event occurs
 *
 * @example
 * ```tsx
 * import { ClusterChooserProps, registerClusterChooser } from '@kinvolk/headlamp-plugin/lib';
 *
 * function MyClusterChooser(props: ClusterChooserProps) {
 *   return <button onClick={clickHandler}>my chooser</button>;
 * }
 *
 * registerClusterChooser(MyClusterChooser)
 * ```
 *
 * @see {@link http://github.com/kinvolk/headlamp/plugins/examples/clusterchooser/ Cluster Chooser example}
 *
 */
export function registerClusterChooser(component: React.ComponentType<ClusterChooserProps> | null) {
  store.dispatch(setClusterChooserButtonComponent(component));
}
