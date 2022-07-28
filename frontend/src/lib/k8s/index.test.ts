import { createRouteURL } from '../router';
import { ResourceClasses } from '.';
import { KubeObjectClass } from './cluster';

// Remove NetworkPolicy since we don't use it.
const k8sClassesToTest = Object.values(ResourceClasses).filter(
  cls => cls.className !== 'NetworkPolicy'
);

const mockK8sObject = (className: string) => ({
  apiVersion: 'v1',
  kind: className,
  metadata: {
    name: 'phony',
    namespace: 'macaroni',
    creationTimestamp: '2020-01-01T00:00:00Z',
    uid: 'phony-01-02-03',
    resourceVersion: '01',
    selfLink: 'http://localhost/api/v1/phony/01',
  },
});

describe('Class tests', () => {
  test('Check plurals', () => {
    Object.values(ResourceClasses).forEach((cls: KubeObjectClass) => {
      expect(cls.pluralName).toBe(cls.pluralName.toLowerCase());
      if (cls.className.endsWith('s')) {
        // Check naive plural for classes ending in 's'.
        expect(cls.pluralName.toLowerCase()).not.toBe(cls.className.toLowerCase() + 's');
      }
    });
  });

  k8sClassesToTest.forEach((cls: KubeObjectClass) => {
    const instance = new cls(mockK8sObject(cls.className));

    test(`List routes for "${cls.className}"`, () => {
      const route = createRouteURL(instance.listRoute, { cluster: 'MyCluster' });
      expect(route).not.toBe('');
      expect(route).not.toBe('/');
    });
  });

  k8sClassesToTest.forEach((cls: KubeObjectClass) => {
    const instance = new cls(mockK8sObject(cls.className));

    test(`Details routes for "${cls.className}"`, () => {
      const route = createRouteURL(instance.detailsRoute, {
        cluster: 'MyCluster',
        name: instance.metadata.name,
        namespace: instance.metadata.namespace,
      });
      expect(route).not.toBe('');
      expect(route).not.toBe('/');
    });
  });
});
