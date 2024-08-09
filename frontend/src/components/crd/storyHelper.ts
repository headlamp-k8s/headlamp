import React from 'react';
import { ApiError, apiFactoryWithNamespace } from '../../lib/k8s/apiProxy';
import { KubeObject, KubeObjectClass, KubeObjectInterface } from '../../lib/k8s/cluster';
import CustomResourceDefinition, { KubeCRD } from '../../lib/k8s/crd';

const mockCRDMap: { [crdName: string]: KubeCRD | null } = {
  'mydefinition.phonyresources.io': {
    kind: 'CustomResourceDefinition',
    apiVersion: 'apiextensions.k8s.io',
    metadata: {
      name: 'mydefinition.phonyresources.io',
      uid: 'phony',
      creationTimestamp: new Date('2021-12-15T14:57:13Z').toString(),
      resourceVersion: '1',
      selfLink: '1',
    },
    spec: {
      group: 'my.phonyresources.io',
      version: 'v1',
      names: {
        plural: 'mycustomresources',
        singular: 'mycustomresource',
        kind: 'MyCustomResource',
        listKind: 'MyCustomResourceList',
        categories: ['all', 'category1'],
      },
      versions: [
        {
          name: 'v1',
          served: false,
          storage: false,
          additionalPrinterColumns: [
            {
              name: 'Test Col',
              type: 'string',
              jsonPath: '.metadata.name',
              description: 'My description',
            },
          ],
        },
      ],
      scope: 'Namespaced',
    },
  },
  loadingcrd: null,
};

const mockCRMap: { [name: string]: KubeObjectInterface | null } = {
  mycustomresource_mynamespace: {
    kind: 'MyCustomResource',
    apiVersion: 'my.phonyresources.io/v1',
    metadata: {
      name: 'mycustomresource',
      uid: 'phony2',
      creationTimestamp: new Date('2021-12-15T14:57:13Z').toString(),
      resourceVersion: '1',
      namespace: 'mynamespace',
      selfLink: '1',
    },
  },
  myothercr_mynamespace: {
    kind: 'MyCustomResource',
    apiVersion: 'my.phonyresources.io/v1',
    metadata: {
      name: 'myotherresource',
      uid: 'phony1',
      creationTimestamp: new Date('2021-12-15T14:57:13Z').toString(),
      resourceVersion: '1',
      namespace: 'mynamespace',
      selfLink: '1',
    },
  },
};

const CRDMockMethods = {
  usePhonyApiGet: (...args: any) => {
    const [setCRD, name] = args;
    const setError = args[3];

    React.useEffect(() => {
      const jsonData = mockCRDMap[name];
      if (jsonData === undefined) {
        const err: ApiError = new Error('No mock CRD for you') as ApiError;
        err['status'] = 404;
        setError && setError(err);
      } else {
        setCRD(!!jsonData ? new CustomResourceDefinition(jsonData) : null);
      }
    }, []);
  },
  usePhonyList: () => {
    const crdInstances: CustomResourceDefinition[] = [];
    Object.values(mockCRDMap).forEach(data => {
      if (!!data) {
        crdInstances.push(new CustomResourceDefinition(data));
      }
    });

    return [crdInstances, null, () => {}, () => {}] as any;
  },
};

class CRMockClass extends KubeObject<KubeObjectInterface> {
  static objectName = 'customresource';
  static apiEndpoint = apiFactoryWithNamespace(['', '', '']);

  static useApiGet<U extends KubeObjectClass>(
    this: U,
    onGet: (item: InstanceType<U> | null) => void,
    name: string,
    namespace?: string,
    setError?: (err: ApiError | null) => void
  ) {
    React.useEffect(() => {
      const jsonData = mockCRMap[name + '_' + namespace];
      if (jsonData === undefined) {
        const err: ApiError = new Error('No mock custom resource for you') as ApiError;
        err['status'] = 404;
        setError && setError(err);
      } else {
        const getCallback = onGet as (item: CRMockClass | null) => void;
        getCallback(!!jsonData ? new CRMockClass(jsonData) : null);
      }
    }, []);
  }

  static useApiList(onList: (...arg: any[]) => any) {
    React.useEffect(() => {
      onList(Object.values(mockCRMap).map(cr => new CRMockClass(cr!)));
    }, []);
  }

  async getAuthorization() {
    return {
      status: {
        allowed: true,
      },
    };
  }
}

export { mockCRDMap, mockCRMap, CRMockClass, CRDMockMethods };
