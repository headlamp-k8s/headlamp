import _ from 'lodash';
import { DefaultSidebars, SidebarEntryProps } from '../../components/Sidebar';
import helpers from '../../helpers';
import { Notification } from '../../lib/notification';
import { Route } from '../../lib/router';
import themesConf, { setTheme } from '../../lib/themes';
import { ClusterChooserType, DetailsViewSectionType } from '../../plugin/registry';
import {
  Action,
  BrandingProps,
  FunctionsToOverride,
  TableColumnsProcessor,
  UI_ADD_TABLE_COLUMNS_PROCESSOR,
  UI_BRANDING_SET_APP_LOGO,
  UI_FUNCTIONS_OVERRIDE,
  UI_HIDE_APP_BAR,
  UI_INITIALIZE_PLUGIN_VIEWS,
  UI_ROUTER_SET_ROUTE,
  UI_ROUTER_SET_ROUTE_FILTER,
  UI_SET_CLUSTER_CHOOSER_BUTTON,
  UI_SET_DETAILS_VIEW,
  UI_SET_NOTIFICATIONS,
  UI_SIDEBAR_SET_EXPANDED,
  UI_SIDEBAR_SET_ITEM,
  UI_SIDEBAR_SET_ITEM_FILTER,
  UI_SIDEBAR_SET_SELECTED,
  UI_SIDEBAR_SET_VISIBLE,
  UI_THEME_SET,
  UI_UPDATE_NOTIFICATION,
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
  views: {
    details: {
      pluginAppendedDetailViews: DetailsViewSectionType[];
    };
    tableColumnsProcessors: TableColumnsProcessor[];
  };
  theme: {
    name: string;
  };
  branding: BrandingProps;
  isVersionDialogOpen: boolean;
  notifications: Notification[];
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
  views: {
    details: {
      pluginAppendedDetailViews: [],
    },
    tableColumnsProcessors: [],
  },
  theme: {
    name: '',
  },
  isVersionDialogOpen: false,
  branding: {
    logo: null,
  },
  notifications: [],
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
    case UI_ADD_TABLE_COLUMNS_PROCESSOR: {
      const processor = action.action;
      const generatedID = processor.id || `generated-id-${Date.now().toString(36)}`;
      const processors = [
        ...newFilters.views.tableColumnsProcessors,
        { id: generatedID, processor: processor.processor },
      ];
      newFilters.views.tableColumnsProcessors = processors;
      break;
    }
    case UI_SET_DETAILS_VIEW: {
      const { action: sectionFunc } = action;
      const detailViews = [...newFilters.views.details.pluginAppendedDetailViews, sectionFunc];
      newFilters.views.details.pluginAppendedDetailViews = detailViews;
      break;
    }
    case UI_THEME_SET: {
      newFilters.theme = action.theme;
      setTheme(newFilters.theme.name);
      break;
    }
    case UI_INITIALIZE_PLUGIN_VIEWS: {
      const newState = _.cloneDeep(INITIAL_STATE);
      // Keep the sidebar folding state in the current one
      newState.sidebar = { ...newState.sidebar, ...setInitialSidebarOpen() };
      return newState;
    }
    case UI_BRANDING_SET_APP_LOGO: {
      const component = action.component;
      newFilters.branding.logo = component;
      break;
    }
    case UI_SET_NOTIFICATIONS: {
      const notifications = action.notifications;
      /* There are two ways user can send notifications either a complete set of array or a single notification
         when handling the array notifications we want to only have unique set of notifications pushed into the UI notifications config
      */
      //if it's an empty array that means this is a request to clear notifications
      if (notifications.length === 0) {
        newFilters.notifications = [];
        helpers.storeNotifications(newFilters.notifications);
        break;
      }
      if (Array.isArray(notifications)) {
        const uniqueNotifications = _.uniqBy(
          [...notifications].concat(newFilters.notifications),
          function (item) {
            return item.id;
          }
        );
        newFilters.notifications = uniqueNotifications;
      } else {
        // check if this notification is already present if not add it
        if (
          newFilters.notifications.findIndex(
            (notification: Notification) => notification.id === notifications.id
          ) === -1
        ) {
          newFilters.notifications.push(notifications);
          newFilters.notifications = [...newFilters.notifications];
        }
      }
      // This way we make sure notifications are always in a consistent order
      newFilters.notifications.sort((n1: Notification, n2: Notification) => {
        return new Date(n2.date).getTime() - new Date(n1.date).getTime();
      });
      helpers.storeNotifications(newFilters.notifications);
      break;
    }
    case UI_UPDATE_NOTIFICATION: {
      const dispatchedNotification = action.dispatchedNotification;
      // if we have an array of updated list of notifications, update the store notifications list with these updated notifications list.
      if (Array.isArray(dispatchedNotification)) {
        newFilters.notifications = newFilters.notifications.map(notification => {
          const newNotification = dispatchedNotification.find(obj => obj.id === notification.id);
          return newNotification ? { ...newNotification } : { ...notification };
        });

        const newObjects = dispatchedNotification.filter(
          obj2 => !newFilters.notifications.some(obj1 => obj1.id === obj2.id)
        );
        newFilters.notifications = [...newFilters.notifications, ...newObjects];
      } else {
        newFilters.notifications = newFilters.notifications.map(notification => {
          if (notification.id === dispatchedNotification.id) {
            const payload = { ...dispatchedNotification };
            payload.seen = true;
            return payload;
          }
          return { ...notification };
        });
      }
      helpers.storeNotifications(newFilters.notifications);
      break;
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
