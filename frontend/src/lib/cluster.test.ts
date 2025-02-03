import helpers from '../helpers';
import { getCluster, getClusterPrefixedPath } from './cluster';

vi.mock('../helpers', () => ({
  default: {
    getBaseUrl: vi.fn(),
    isElectron: vi.fn(),
  },
}));

describe('getCluster', () => {
  const originalWindow = { ...window };

  beforeEach(() => {
    vi.clearAllMocks();

    window.location = {
      ...originalWindow.location,
      pathname: '',
      hash: '',
    } as Window['location'] & string;
  });

  afterEach(() => {
    window = { ...originalWindow };
  });

  describe('Browser Environment', () => {
    beforeEach(() => {
      vi.mocked(helpers.isElectron).mockReturnValue(false);
    });

    it('should extract cluster name from pathname without base URL', () => {
      vi.mocked(helpers.getBaseUrl).mockReturnValue('');
      window.location.pathname = '/c/test-cluster/workloads';

      expect(getCluster()).toBe('test-cluster');
    });

    it('should extract cluster name from pathname with base URL', () => {
      vi.mocked(helpers.getBaseUrl).mockReturnValue('/base');
      window.location.pathname = '/base/c/test-cluster/workloads';

      expect(getCluster()).toBe('test-cluster');
    });

    it('should return null for non-cluster path', () => {
      vi.mocked(helpers.getBaseUrl).mockReturnValue('');
      window.location.pathname = '/workloads';

      expect(getCluster()).toBeNull();
    });

    it('should handle trailing slashes correctly', () => {
      vi.mocked(helpers.getBaseUrl).mockReturnValue('');
      window.location.pathname = '/c/test-cluster/';

      expect(getCluster()).toBe('test-cluster');
    });
  });

  describe('Electron Environment', () => {
    beforeEach(() => {
      vi.mocked(helpers.isElectron).mockReturnValue(true);
    });

    it('should extract cluster name from hash', () => {
      window.location.hash = '#/c/test-cluster/workloads';

      expect(getCluster()).toBe('test-cluster');
    });

    it('should return null for non-cluster hash', () => {
      window.location.hash = '#/workloads';

      expect(getCluster()).toBeNull();
    });

    it('should handle empty hash', () => {
      window.location.hash = '';

      expect(getCluster()).toBeNull();
    });
  });
});

describe('getClusterPrefixedPath', () => {
  it('should handle null path', () => {
    expect(getClusterPrefixedPath()).toBe('/c/:cluster');
  });

  it('should handle path without leading slash', () => {
    expect(getClusterPrefixedPath('path')).toBe('/c/:cluster/path');
  });

  it('should handle path with leading slash', () => {
    expect(getClusterPrefixedPath('/path')).toBe('/c/:cluster/path');
  });
});
