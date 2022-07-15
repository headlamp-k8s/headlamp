import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ResourceClasses } from '../../lib/k8s';
import { ApiError, apiFactory, apiFactoryWithNamespace } from '../../lib/k8s/apiProxy';
import { KubeObject, makeKubeObject } from '../../lib/k8s/cluster';
import CustomResourceDefinition, { KubeCRD } from '../../lib/k8s/crd';
import store from '../../redux/stores/store';
import { CustomResourceDetails, CustomResourceDetailsProps } from './CustomResourceDetails';

const MOCK_CRD_JSON: { [crdName: string]: KubeCRD | null } = {
  'mydefinition.phonyresources.io': {
    kind: 'CustomResourceDefinition',
    apiVersion: 'apiextensions.k8s.io',
    metadata: {
      name: 'mydefinition.phonyresources.io',
      uid: 'phony',
      creationTimestamp: new Date('2021-12-15T14:57:13Z'),
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

class CRDMockClass extends CustomResourceDefinition {
  static apiEndpoint = apiFactory(['apiextensions.k8s.io', 'v1', 'customresourcedefinitions']);

  static useApiGet(...args: Parameters<typeof CustomResourceDefinition.useApiGet>) {
    const [setCRD, name] = args;
    const setError = args[3];

    React.useEffect(() => {
      const jsonData = MOCK_CRD_JSON[name];
      if (jsonData === undefined) {
        const err: ApiError = new Error('No mock CRD for you') as ApiError;
        err['status'] = 404;
        setError && setError(err);
      } else {
        setCRD(!!jsonData ? new CustomResourceDefinition(jsonData) : null);
      }
    }, []);
  }
}

// So we override the class and rely on the testing useApiGet
ResourceClasses['CustomResourceDefinition'] = CRDMockClass;

export default {
  title: 'crd/CustomResourceDetails',
  component: CustomResourceDetails,
  argTypes: {},
  decorators: [
    Story => (
      <MemoryRouter>
        <Provider store={store}>
          <Story />
        </Provider>
      </MemoryRouter>
    ),
  ],
} as Meta;

const Template: Story<CustomResourceDetailsProps> = args => <CustomResourceDetails {...args} />;

const MOCK_CR_JSON: { [name: string]: KubeObject | null } = {
  mycustomresource_mynamespace: {
    kind: 'MyCustomResource',
    apiVersion: 'my.phonyresources.io/v1',
    metadata: {
      name: 'mycustomresource',
      uid: 'phony',
      creationTimestamp: new Date('2021-12-15T14:57:13Z').toString(),
      resourceVersion: '1',
      namespace: 'mynamespace',
      selfLink: '1',
    },
  },
};

class CRMockClass extends makeKubeObject<KubeObject>('customresource') {
  static apiEndpoint = apiFactoryWithNamespace(['', '', '']);

  static useApiGet(
    setItem: (item: CRMockClass | null) => void,
    name: string,
    namespace?: string,
    setError?: (err: ApiError) => void
  ) {
    MOCK_CR_JSON[name + '_' + namespace];

    React.useEffect(() => {
      const jsonData = MOCK_CR_JSON[name + '_' + namespace];
      if (jsonData === undefined) {
        const err: ApiError = new Error('No mock custom resource for you') as ApiError;
        err['status'] = 404;
        setError && setError(err);
      } else {
        setItem(!!jsonData ? new CRMockClass(jsonData) : null);
      }
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

// So it gets picked up by the component
ResourceClasses['mycustomresources'] = CRMockClass;

export const NoError = Template.bind({});
NoError.args = {
  crName: 'mycustomresource',
  crd: 'mydefinition.phonyresources.io',
  namespace: 'mynamespace',
};

export const LoadingCRD = Template.bind({});
LoadingCRD.args = {
  crName: 'loadingcr',
  crd: 'loadingcrd',
  namespace: '-',
};

export const ErrorGettingCRD = Template.bind({});
ErrorGettingCRD.args = {
  crName: 'doesnotmatter',
  crd: 'error.crd.io',
  namespace: '-',
};

export const ErrorGettingCR = Template.bind({});
ErrorGettingCR.args = {
  crName: 'nonexistentcustomresource',
  crd: 'mydefinition.phonyresources.io',
  namespace: '-',
};
