import { Route } from '../lib/router';
import {
  setAppBarAction,
  setDetailsViewHeaderAction,
  setRoute,
  setSidebarItem,
} from '../redux/actions/actions';
import store from '../redux/stores/store';

export default class Registry {
  /**
   * Add a SidebarItem.
   *
   * @param parentName - the name of the parent SidebarItem.
   * @param itemName - name of this SidebarItem.
   * @param itemLabel - label to display.
   * @param url - the URL to go to, when this item is followed.
   * @param opts - ... todo
   *
   * @example
   *
   * ```javascript
   * registerSidebarItem('cluster', 'traces', 'Traces', '/traces');
   * ```
   */
  registerSidebarItem(
    parentName: string,
    itemName: string,
    itemLabel: string,
    url: string,
    opts = { useClusterURL: true }
  ) {
    store.dispatch(
      setSidebarItem({
        name: itemName,
        label: itemLabel,
        url,
        useClusterURL: !!opts.useClusterURL,
        parent: parentName,
      })
    );
  }

  /**
   * Add a Route for a component.
   *
   * @param routeSpec - details of URL, highlighted sidebar and component to use.
   *
   * @see {@link https://github.com/kinvolk/headlamp/blob/main/frontend/src/lib/router.tsx Route examples}
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
}
