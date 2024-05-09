import filterReducer, {
  FilterState,
  initialState,
  resetFilter,
  setNamespaceFilter,
} from './filterSlice';

describe('filterSlice', () => {
  let state: FilterState;

  beforeEach(() => {
    state = initialState;
  });

  it('should handle setNamespaceFilter', () => {
    const namespaces = ['default', 'kube-system'];
    state = filterReducer(state, setNamespaceFilter(namespaces));
    expect(state.namespaces).toEqual(new Set(namespaces));
  });

  it('should handle resetFilter', () => {
    state = {
      ...state,
      namespaces: new Set(['default']),
    };

    state = filterReducer(state, resetFilter());
    expect(state).toEqual(initialState);
  });
});
