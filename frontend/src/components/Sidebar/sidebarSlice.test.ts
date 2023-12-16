import sidebarReducer, {
  DefaultSidebars,
  initialState,
  setInitialSidebarOpen,
  setSidebarItem,
  setSidebarItemFilter,
  setSidebarSelected,
  setSidebarVisible,
  setWhetherSidebarOpen,
  SidebarEntry,
  SidebarState,
} from './sidebarSlice';

describe('sidebarSlice', () => {
  describe('setSidebarSelected', () => {
    it('should handle setting the selected item and its visibility', () => {
      const selectedPayload = { item: 'Dashboard', sidebar: DefaultSidebars.HOME };
      const state: SidebarState = sidebarReducer(initialState, setSidebarSelected(selectedPayload));
      expect(state.selected).toEqual(selectedPayload);
      expect(state.isVisible).toBe(true);
    });

    it('should handle unsetting the selected item and its visibility', () => {
      const selectedPayload = { item: null, sidebar: null };
      const state: SidebarState = sidebarReducer(initialState, setSidebarSelected(selectedPayload));
      expect(state.selected).toEqual(selectedPayload);
      expect(state.isVisible).toBe(false);
    });
  });

  describe('setSidebarVisible', () => {
    it('should handle sidebar visibility being set to true', () => {
      const state: SidebarState = sidebarReducer(initialState, setSidebarVisible(true));
      expect(state.isVisible).toBe(true);
    });

    it('should handle sidebar visibility being set to false', () => {
      const state: SidebarState = sidebarReducer(initialState, setSidebarVisible(false));
      expect(state.isVisible).toBe(false);
    });
  });

  describe('setSidebarItem', () => {
    it('should handle adding a new item to the sidebar entries', () => {
      const newItem: SidebarEntry = {
        name: 'NewEntry',
        label: 'New Entry',
        sidebar: DefaultSidebars.HOME,
      };
      const state: SidebarState = sidebarReducer(initialState, setSidebarItem(newItem));
      expect(state.entries['NewEntry']).toEqual(newItem);
    });
  });

  describe('setSidebarItemFilter', () => {
    it('should handle adding a new filter to the sidebar', () => {
      const filter = (entry: SidebarEntry) => (entry.name === 'Filtered' ? null : entry);
      const state: SidebarState = sidebarReducer(initialState, setSidebarItemFilter(filter));
      expect(state.filters).toContain(filter);
    });
  });

  describe('setWhetherSidebarOpen', () => {
    it('should handle setting the sidebar open state to true and storing it in localStorage', () => {
      const previousValue = localStorage.getItem('sidebar');
      const state: SidebarState = sidebarReducer(initialState, setWhetherSidebarOpen(true));
      expect(state.isSidebarOpen).toBe(true);
      expect(state.isSidebarOpenUserSelected).toBe(true);
      expect(localStorage.getItem('sidebar')).not.toEqual(previousValue);
    });

    it('should handle setting the sidebar open state to false and storing it in localStorage', () => {
      const previousValue = localStorage.getItem('sidebar');
      const state: SidebarState = sidebarReducer(initialState, setWhetherSidebarOpen(false));
      expect(state.isSidebarOpen).toBe(false);
      expect(state.isSidebarOpenUserSelected).toBe(false);
      expect(localStorage.getItem('sidebar')).not.toEqual(previousValue);
    });
  });
});

describe('setInitialSidebarOpen', () => {
  let originalInnerWidth: number;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    Object.defineProperty(window, 'innerWidth', {
      value: originalInnerWidth,
    });
  });

  it('should use the value from localStorage when available', () => {
    localStorage.setItem('sidebar', JSON.stringify({ shrink: false }));
    expect(setInitialSidebarOpen().isSidebarOpen).toBe(true);

    localStorage.setItem('sidebar', JSON.stringify({ shrink: true }));
    expect(setInitialSidebarOpen().isSidebarOpen).toBe(false);

    localStorage.setItem('sidebar', JSON.stringify({}));
    expect(setInitialSidebarOpen().isSidebarOpen).toBe(true);
  });

  it('should use the window width when localStorage is not set', () => {
    expect(localStorage.getItem('sidebar')).toBeNull();
    // Set width less than md breakpoint.
    Object.defineProperty(window, 'innerWidth', {
      value: 800,
      configurable: true,
    });

    expect(setInitialSidebarOpen().isSidebarOpen).toBe(false);
  });
});
