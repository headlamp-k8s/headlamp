import { Route } from '../lib/router';
import { setAppBarAction, setDetailsViewHeaderAction, setRoute, setSidebarItem } from '../redux/actions/actions';
import store from '../redux/stores/store';

export default class Registry {
  registerSidebarItem(parentName: string, itemName: string,
                      itemLabel: string, url: string,
                      opts = {useClusterURL: true}) {
    store.dispatch(setSidebarItem({
      name: itemName,
      label: itemLabel,
      url,
      useClusterURL: !!opts.useClusterURL,
      parent: parentName
    }));
  }

  registerRoute(routeSpec: Route) {
    store.dispatch(setRoute(routeSpec));
  }

  registerDetailsViewHeaderAction(actionName: string,
                                  actionFunc: (...args: any[]) => JSX.Element | null) {
    store.dispatch(setDetailsViewHeaderAction(actionName, actionFunc));
  }

  registerAppBarAction(actionName: string, actionFunc: (...args: any[]) => JSX.Element | null) {
    store.dispatch(setAppBarAction(actionName, actionFunc));
  }
}
