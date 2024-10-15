import { flattenClusterListItems } from './util';

describe('flattenClusterListItems', () => {
  it('should return a flattened list of items', () => {
    const result = flattenClusterListItems(
      { cluster1: [1, 2, 3], cluster2: [4, 5] },
      { cluster3: [6, 7], cluster4: null },
      null
    );
    expect(result).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('should return null if all clusters are null', () => {
    const result = flattenClusterListItems({ cluster1: null }, { cluster2: null }, null);
    expect(result).toBeNull();
  });

  it('should return null if there are no items', () => {
    const result = flattenClusterListItems({ cluster1: [] }, { cluster2: [] });
    expect(result).toBeNull();
  });

  it('should handle mixed null and non-null clusters', () => {
    const result = flattenClusterListItems(
      { cluster1: [1, 2], cluster2: null },
      { cluster3: [3, 4] },
      null
    );
    expect(result).toEqual([1, 2, 3, 4]);
  });
});
