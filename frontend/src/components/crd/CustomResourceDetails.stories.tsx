import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { ResourceClasses } from '../../lib/k8s';
import { TestContext } from '../../test';
import { CustomResourceDetails, CustomResourceDetailsProps } from './CustomResourceDetails';
import { CRMockClass } from './storyHelper';

// So we can test with a mocked CR.
ResourceClasses['mycustomresources'] = CRMockClass;

export default {
  title: 'crd/CustomResourceDetails',
  component: CustomResourceDetails,
  argTypes: {},
  parameters: {
    msw: {
      handlers: {
        storyBase: [
          http.get(
            'http://localhost:4466/apis/my.phonyresources.io/v1/namespaces/mynamespace/mycustomresources/mycustomresource',
            () =>
              HttpResponse.json({
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
              })
          ),
          http.get('http://localhost:4466/apis/my.phonyresources.io/v1/mycustomresources', () =>
            HttpResponse.json({})
          ),
          http.get(
            'http://localhost:4466/apis/my.phonyresources.io/v1/mycustomresources/nonexistentcustomresource',
            () => HttpResponse.error()
          ),
          http.get(
            'http://localhost:4466/apis/apiextensions.k8s.io/v1/customresourcedefinitions/error.crd.io',
            () => HttpResponse.error()
          ),
          http.get(
            'http://localhost:4466/apis/apiextensions.k8s.io/v1/customresourcedefinitions/mydefinition.phonyresources.io',
            () => HttpResponse.error()
          ),
          http.get('http://localhost:4466/api/v1/namespaces/mynamespace/events', () =>
            HttpResponse.error()
          ),
        ],
      },
    },
  },
  decorators: [
    Story => {
      return (
        <TestContext>
          <Story />
        </TestContext>
      );
    },
  ],
} as Meta;

const Template: StoryFn<CustomResourceDetailsProps> = args => <CustomResourceDetails {...args} />;

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
