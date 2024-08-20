export const mockCRD = {
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
};

export const mockCRList = [
  {
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
  {
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
];
