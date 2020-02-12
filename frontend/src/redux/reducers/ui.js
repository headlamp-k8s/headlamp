import { UI_SIDEBAR_SET_ITEM, UI_SIDEBAR_SET_SELECTED, UI_SIDEBAR_SET_VISIBLE } from '../actions/actions';

export const INITIAL_STATE = {
  sidebar: {
    selected: 'cluster',
    isVisible: true,
    entries: {}
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
    default:
      return state;
  };

  return newFilters;
}

export default reducer;
