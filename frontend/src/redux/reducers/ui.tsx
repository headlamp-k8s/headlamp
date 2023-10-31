import _ from 'lodash';
import { DefaultSidebars, SidebarEntryProps } from '../../components/Sidebar';
import { Route } from '../../lib/router';
import themesConf from '../../lib/themes';
import { ClusterChooserType } from '../../plugin/registry';
import {
  Action,
  FunctionsToOverride,
  UI_FUNCTIONS_OVERRIDE,
  UI_HIDE_APP_BAR,
  UI_INITIALIZE_PLUGIN_VIEWS,
  UI_ROUTER_SET_ROUTE,
  UI_ROUTER_SET_ROUTE_FILTER,
  UI_SET_CLUSTER_CHOOSER_BUTTON,
  UI_SIDEBAR_SET_EXPANDED,
  UI_SIDEBAR_SET_ITEM,
  UI_SIDEBAR_SET_ITEM_FILTER,
  UI_SIDEBAR_SET_SELECTED,
  UI_SIDEBAR_SET_VISIBLE,
  UI_VERSION_DIALOG_OPEN,
} from '../actions/actions';

type SidebarEntryFilterFuncType = (entry: SidebarEntryProps) => SidebarEntryProps | null;
type RouteFilterFuncType = (entry: Route) => Route | null;

export interface UIState {
  sidebar: {
    selected: {
      item: string | null;
      sidebar: string | DefaultSidebars | null;
    };
    isVisible: boolean;
    isSidebarOpen?: boolean;
    /** This is only set to true/false based on a user interaction. */
    isSidebarOpenUserSelected?: boolean;
    entries: {
      [propName: string]: SidebarEntryProps;
    };
    filters: SidebarEntryFilterFuncType[];
  };
  routes: {
    [path: string]: Route;
  };
  routeFilters: RouteFilterFuncType[];
  isVersionDialogOpen: boolean;
  clusterChooserButtonComponent?: ClusterChooserType;
  hideAppBar?: boolean;
  functionsToOverride: FunctionsToOverride;
}

function setInitialSidebarOpen() {
  let defaultOpen;

  const openUserSelected = (function () {
    const sidebar = localStorage?.getItem('sidebar');
    if (sidebar) {
      return !JSON.parse(sidebar).shrink;
    }
  })();
  if (openUserSelected !== undefined) {
    defaultOpen = openUserSelected;
  } else {
    // Have to use window.innerWidth because useMediaQuery is not initially correct.
    //  useMediaQuery first is wrong, and then give a correct answer after.
    defaultOpen = window?.innerWidth
      ? window.innerWidth > themesConf.light.breakpoints.values.md
      : true;
  }

  return {
    isSidebarOpen: defaultOpen,
    isSidebarOpenUserSelected: undefined,
  };
}

export const INITIAL_STATE: UIState = {
  sidebar: {
    ...setInitialSidebarOpen(),
    selected: {
      item: null,
      sidebar: null,
    },
    isVisible: false,
    entries: {},
    filters: [],
  },
  routes: {
    // path -> Route
  },
  routeFilters: [],
  isVersionDialogOpen: false,
  hideAppBar: false,
  functionsToOverride: {},
};

function reducer(state = _.cloneDeep(INITIAL_STATE), action: Action) {
  const newFilters = { ..._.cloneDeep(state) };

  switch (action.type) {
    case UI_SIDEBAR_SET_SELECTED: {
      newFilters.sidebar = {
        ...newFilters.sidebar,
        selected: { ...action.selected },
        isVisible: !!action.selected,
      };
      break;
    }
    case UI_SIDEBAR_SET_VISIBLE: {
      newFilters.sidebar = {
        ...newFilters.sidebar,
        isVisible: action.isVisible,
      };
      break;
    }
    case UI_SIDEBAR_SET_ITEM: {
      const entries = { ...newFilters.sidebar.entries };
      entries[action.item.name] = action.item;
      newFilters.sidebar = {
        ...newFilters.sidebar,
        entries,
      };
      break;
    }
    case UI_SIDEBAR_SET_ITEM_FILTER: {
      const filters = [...newFilters.sidebar.filters, action.filterFunc];
      newFilters.sidebar = {
        ...newFilters.sidebar,
        filters,
      };
      break;
    }
    case UI_SIDEBAR_SET_EXPANDED: {
      newFilters.sidebar = {
        ...newFilters.sidebar,
        isSidebarOpen: action.isSidebarOpen,
        isSidebarOpenUserSelected: action.isSidebarOpenUserSelected,
      };
      break;
    }
    case UI_HIDE_APP_BAR: {
      newFilters.hideAppBar = action.hideAppBar;
      break;
    }
    case UI_ROUTER_SET_ROUTE: {
      const routes = { ...newFilters.routes };
      routes[action.route.path] = action.route;
      newFilters.routes = routes;
      break;
    }
    case UI_ROUTER_SET_ROUTE_FILTER: {
      const routeFilters = [...newFilters.routeFilters, action.filterFunc];
      newFilters.routeFilters = routeFilters;
      break;
    }
    case UI_INITIALIZE_PLUGIN_VIEWS: {
      const newState = _.cloneDeep(INITIAL_STATE);
      // Keep the sidebar folding state in the current one
      newState.sidebar = { ...newState.sidebar, ...setInitialSidebarOpen() };
      return newState;
    }
    case UI_SET_CLUSTER_CHOOSER_BUTTON: {
      const component = action.component;
      newFilters.clusterChooserButtonComponent = component;
      break;
    }
    case UI_VERSION_DIALOG_OPEN: {
      newFilters.isVersionDialogOpen = action.isVersionDialogOpen;
      break;
    }
    case UI_FUNCTIONS_OVERRIDE: {
      const functionToOverride = action.override;
      for (const key in functionToOverride) {
        if (functionToOverride.hasOwnProperty(key)) {
          newFilters.functionsToOverride[key] = functionToOverride[key];
        }
      }
      break;
    }
    default:
      return state;
  }

  return newFilters;
}

export default reducer;
