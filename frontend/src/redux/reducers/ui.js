import { UI_DETAILS_VIEW_SET_HEADER_ACTION, UI_ROUTER_SET_ROUTE, UI_SIDEBAR_SET_ITEM, UI_SIDEBAR_SET_SELECTED, UI_SIDEBAR_SET_VISIBLE } from '../actions/actions';

export const INITIAL_STATE = {
  sidebar: {
    selected: 'cluster',
    isVisible: false,
    entries: {}
  },
  routes: {
    // path -> component
  },
  views: {
    details: {
      headerActions: {
        // action-name -> action-callback
      }
    }
  }
};

function reducer(state = INITIAL_STATE, action) {
  const newFilters = {...state};
  switch(action.type) {
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
      const entries = {...newFilters.sidebar.entries};
      entries[action.item.name] = action.item;

      newFilters.sidebar = {
        ...newFilters.sidebar,
        entries
      };
      break;
    }
    case UI_ROUTER_SET_ROUTE: {
      const routes = {...newFilters.routes};
      routes[action.route.path] = action.route;
      newFilters.routes = routes;
      break;
    }
    case UI_DETAILS_VIEW_SET_HEADER_ACTION: {
      const headerActions = {...newFilters.views.details.headerActions};
      headerActions[action.actionName] = action.action;
      newFilters.views.details.headerActions = headerActions;
      break;
    }
    default:
      return state;
  };

  return newFilters;
}

export default reducer;
