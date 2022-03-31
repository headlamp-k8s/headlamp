import { IconProps } from '@iconify/react';
import _ from 'lodash';
import themesConf, { setTheme } from '../../lib/themes';
import { sectionFunc } from '../../plugin/registry';
import {
  Action,
  BrandingProps,
  HeaderActionFunc,
  UI_APP_BAR_SET_ACTION,
  UI_BRANDING_SET_APP_LOGO,
  UI_DETAILS_VIEW_SET_HEADER_ACTION,
  UI_PLUGINS_LOADED,
  UI_RESET_PLUGIN_VIEWS,
  UI_ROUTER_SET_ROUTE,
  UI_SET_DETAILS_VIEW,
  UI_SIDEBAR_SET_EXPANDED,
  UI_SIDEBAR_SET_ITEM,
  UI_SIDEBAR_SET_SELECTED,
  UI_SIDEBAR_SET_VISIBLE,
  UI_THEME_SET,
} from '../actions/actions';

export interface SidebarEntry {
  name: string;
  label: string;
  isParentAViewInItself?: boolean;
  parent?: string | null;
  url?: string;
  useClusterURL?: boolean;
  subList?: this[];
  icon?: IconProps['icon'];
}

export interface UIState {
  sidebar: {
    selected: string | null;
    isVisible: boolean;
    isSidebarOpen?: boolean;
    /** This is only set to true/false based on a user interaction. */
    isSidebarOpenUserSelected?: boolean;
    entries: {
      [propName: string]: SidebarEntry;
    };
  };
  routes: {
    [path: string]: any;
  };
  views: {
    details: {
      headerActions: {
        [name: string]: HeaderActionFunc;
      };
      pluginAppendedDetailViews: Array<{
        sectionName: string;
        sectionFunc: sectionFunc;
      }>;
    };
    appBar: {
      actions: {
        [name: string]: HeaderActionFunc;
      };
    };
  };
  theme: {
    name: string;
  };
  branding: BrandingProps;
  pluginsLoaded: boolean;
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
    selected: null,
    isVisible: false,
    entries: {},
  },
  routes: {
    // path -> component
  },
  views: {
    details: {
      headerActions: {
        // action-name -> action-callback
      },
      pluginAppendedDetailViews: [],
    },
    appBar: {
      actions: {
        // action-name -> action-callback
      },
    },
  },
  theme: {
    name: '',
  },
  pluginsLoaded: false,
  branding: {
    logo: null,
  },
};

function reducer(state = _.cloneDeep(INITIAL_STATE), action: Action) {
  const newFilters = { ...state };
  switch (action.type) {
    case UI_SIDEBAR_SET_SELECTED: {
      newFilters.sidebar = {
        ...newFilters.sidebar,
        selected: action.selected,
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
    case UI_SIDEBAR_SET_EXPANDED: {
      newFilters.sidebar = {
        ...newFilters.sidebar,
        isSidebarOpen: action.isSidebarOpen,
        isSidebarOpenUserSelected: action.isSidebarOpenUserSelected,
      };
      break;
    }
    case UI_ROUTER_SET_ROUTE: {
      const routes = { ...newFilters.routes };
      routes[action.route.path] = action.route;
      newFilters.routes = routes;
      break;
    }
    case UI_DETAILS_VIEW_SET_HEADER_ACTION: {
      const headerActions = { ...newFilters.views.details.headerActions };
      headerActions[action.action as string] = action.action;
      newFilters.views.details.headerActions = headerActions;
      break;
    }
    case UI_SET_DETAILS_VIEW: {
      const { sectionName, action: sectionFunc } = action;
      const detailViews = [...newFilters.views.details.pluginAppendedDetailViews];
      detailViews.push({ sectionName, sectionFunc });
      newFilters.views.details.pluginAppendedDetailViews = detailViews;
      break;
    }
    case UI_APP_BAR_SET_ACTION: {
      const appBarActions = { ...newFilters.views.appBar.actions };
      appBarActions[action.name as string] = action.action;
      newFilters.views.appBar.actions = appBarActions;
      break;
    }
    case UI_THEME_SET: {
      newFilters.theme = action.theme;
      setTheme(newFilters.theme.name);
      break;
    }
    case UI_RESET_PLUGIN_VIEWS: {
      const newState = _.cloneDeep(INITIAL_STATE);
      // Keep the sidebar folding state in the current one
      newState.sidebar = { ...newState.sidebar, ...setInitialSidebarOpen() };
      return newState;
    }
    case UI_PLUGINS_LOADED: {
      newFilters.pluginsLoaded = action.pluginsLoadedState;
      break;
    }
    case UI_BRANDING_SET_APP_LOGO: {
      const component = action.component;
      newFilters.branding.logo = component;
      break;
    }
    default:
      return state;
  }

  return newFilters;
}

export default reducer;
