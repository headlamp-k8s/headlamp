import React from 'react';
import { KubeObject } from '../lib/k8s/cluster';
import { Route } from '../lib/router';
import {
  AppLogoProps,
  ClusterChooserProps,
  setAppBarAction,
  setBrandingAppLogoComponent,
  setClusterChooserButtonComponent,
  setDetailsView,
  setDetailsViewHeaderAction,
  setRoute,
  setSidebarItem,
} from '../redux/actions/actions';
import { SidebarEntry } from '../redux/reducers/ui';
import store from '../redux/stores/store';

export interface SectionFuncProps {
  title: string;
  component: (props: { resource: any }) => JSX.Element | null;
}
export type sectionFunc = (resource: KubeObject) => SectionFuncProps | null | undefined;
export type { AppLogoProps };
export type { ClusterChooserProps };

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
   * ```javascript
   * register.registerSidebarItem('cluster', 'traces', 'Traces', '/traces');
   * ```
   *
   * @see {@link http://github.com/kinvolk/headlamp/plugins/examples/podcounter/ podcounter example}
   */
  registerSidebarItem(
    parentName: string | null,
    itemName: string,
    itemLabel: string,
    url: string,
    opts: Pick<SidebarEntry, 'useClusterURL' | 'icon'> = { useClusterURL: true }
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
   * ```JSX
   * // Add a route that will display the given component and select
   * // the "traces" sidebar item.
   * register.registerRoute({
   *   path: '/traces',
   *   sidebar: 'traces',
   *   component: () => <TraceList />
   * });
   * ```
   *
   * @see {@link https://github.com/kinvolk/headlamp/blob/main/frontend/src/lib/router.tsx Route examples}
   * @see {@link http://github.com/kinvolk/headlamp/plugins/examples/sidebar/ sidebar example}
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
   * ```JSX
   * register.registerDetailsViewHeaderAction('traces', (props) =>
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
   * ```JSX
   * register.registerAppBarAction('monitor', () => <MonitorLink /> );
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
   * ```JSX
   * function myDetailView({resource: KubeObject}) {
   *   return {
   *    title: 'Block I/O Latency',
   *    component: (props) => <BioLatency {...props} resource={resource}/>
   *   }
   * }
   *
   * register.registerDetailsViewSection("biolatency", myDetailView);
   * ```
   */
  registerDetailsViewSection(sectionName: string, sectionFunc: sectionFunc) {
    store.dispatch(setDetailsView(sectionName, sectionFunc));
  }

  /**
   * Add a logo for Headlamp to use instead of the default one.
   *
   * @param component is a React Component that takes two required props
   * ```JSX logoType``` which is a constant string literal that accepts either
   * of the two values ```JSX small``` or ```JSX large``` depending on whether
   * the sidebar is in shrink or expaned state so that you can change your logo
   * from small to large and the other optional prop is the ```JSX themeName```
   * which is a string with two values 'light' and 'dark' base on which theme is selected.
   *
   * @example
   * ```JSX
   * import { AppLogoProps } from '@kinvolk/headlamp-plugin/lib';
   *
   * function MyLogo(props: AppLogoProps) {
   *   return 'my logo';
   * }
   *
   * register.registerAppLogo(MyLogo)
   * ```
   *
   * There is a more complete logo example in plugins/examples/change-logo.
   *
   * @see {@link http://github.com/kinvolk/headlamp/plugins/examples/change-logo/|change-logo-example}
   *
   */
  registerAppLogo(component: React.ComponentType<AppLogoProps> | null) {
    store.dispatch(setBrandingAppLogoComponent(component));
  }

  /**
   * Use a custom cluster chooser button
   *
   * @param component is a React Component that takes one required props ```JSX clickHandler``` which is the
   * action handler that happens when the custom chooser button component click event occurs
   *
   * @example
   * ```JSX
   * import { ClusterChooserProps } from '@kinvolk/headlamp-plugin/lib';
   *
   * function MyClusterChooser(props: ClusterChooserProps) {
   *   return <button onClick={clickHandler}>my chooser</button>;
   * }
   *
   * registry.registerClusterChooser(MyClusterChooser)
   * ```
   *
   * @see {@link http://github.com/kinvolk/headlamp/plugins/examples/cluster-chooser/ cluster chooser example}
   *
   */
  registerClusterChooser(component: React.ComponentType<ClusterChooserProps> | null) {
    store.dispatch(setClusterChooserButtonComponent(component));
  }

  /**
   * @deprecated Please use registerClusterChooser. This will be removed in headlamp-plugin 0.4.11.
   */
  registerClusterChooserComponent(component: React.ComponentType<ClusterChooserProps> | null) {
    console.log(
      'registerClusterChooserComponent is deprecated. Please use registerClusterChooser.'
    );
    store.dispatch(setClusterChooserButtonComponent(component));
  }
}
