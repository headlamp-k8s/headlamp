import { describe, expect, it } from 'vitest';
import { KubeObjectEndpoint } from './KubeObjectEndpoint';

describe('KubeObjectEndpoint', () => {
  describe('toUrl', () => {
    it('should generate URL for core resources without namespace', () => {
      const endpoint = { version: 'v1', resource: 'pods' };
      const url = KubeObjectEndpoint.toUrl(endpoint);
      expect(url).toBe('api/v1/pods');
    });

    it('should generate URL for core resources with namespace', () => {
      const endpoint = { version: 'v1', resource: 'pods' };
      const url = KubeObjectEndpoint.toUrl(endpoint, 'default');
      expect(url).toBe('api/v1/namespaces/default/pods');
    });

    it('should generate URL for custom resources without namespace', () => {
      const endpoint = { group: 'apps', version: 'v1', resource: 'deployments' };
      const url = KubeObjectEndpoint.toUrl(endpoint);
      expect(url).toBe('apis/apps/v1/deployments');
    });

    it('should generate URL for custom resources with namespace', () => {
      const endpoint = { group: 'apps', version: 'v1', resource: 'deployments' };
      const url = KubeObjectEndpoint.toUrl(endpoint, 'default');
      expect(url).toBe('apis/apps/v1/namespaces/default/deployments');
    });

    it('should generate URL for custom resources with empty group', () => {
      const endpoint = { group: '', version: 'v1', resource: 'services' };
      const url = KubeObjectEndpoint.toUrl(endpoint);
      expect(url).toBe('api/v1/services');
    });

    it('should generate URL for custom resources with empty group and namespace', () => {
      const endpoint = { group: '', version: 'v1', resource: 'services' };
      const url = KubeObjectEndpoint.toUrl(endpoint, 'default');
      expect(url).toBe('api/v1/namespaces/default/services');
    });
  });
});
