import { setDetailsViewHeaderAction, setRoute, setSidebarItem } from '../redux/actions/actions';
import store from '../redux/stores/store';

export default class Registry {
  registerSidebarItem(parentName, itemName, itemLabel, url, opts = {useClusterURL: true}) {
    store.dispatch(setSidebarItem({
      name: itemName,
      label: itemLabel,
      url,
      useClusterURL: !!opts.useClusterURL,
      parent: parentName
    }));
  }

  registerRoute(routeSpec) {
    store.dispatch(setRoute(routeSpec));
  }

  registerDetailsViewHeaderAction(actionName, actionFunc) {
    store.dispatch(setDetailsViewHeaderAction(actionName, actionFunc));
  }
}
