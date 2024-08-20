import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext, TestContextProps } from '../../test';
import CustomResourceDefinitionDetails from './Details';
import CustomResourceDefinitionList from './List';
import { mockCRD, mockCRList } from './storyHelper';

interface MockerStory {
  viewType: 'list' | 'details';
  name?: string;
  namespace?: string;
}

export default {
  title: 'crd/CustomResourceDefinition',
  argTypes: {},
  decorators: [Story => <Story />],
  parameters: {
    msw: {
      handlers: {
        storyBase: [
          http.get(
            'http://localhost:4466/apis/apiextensions.k8s.io/v1beta1/customresourcedefinitions',
            () => HttpResponse.error()
          ),
          http.get(
            'http://localhost:4466/apis/apiextensions.k8s.io/v1/customresourcedefinitions',
            () =>
              HttpResponse.json({
                kind: 'List',
                metadata: {},
                items: [mockCRD],
              })
          ),
          http.get(
            'http://localhost:4466/apis/apiextensions.k8s.io/v1/customresourcedefinitions/mydefinition.phonyresources.io',
            () => HttpResponse.json(mockCRD)
          ),
          http.get('http://localhost:4466/apis/my.phonyresources.io/v1/mycustomresources', () =>
            HttpResponse.json({
              kind: 'List',
              metadata: {},
              items: mockCRList,
            })
          ),
        ],
      },
    },
  },
} as Meta;

const Template: StoryFn<MockerStory> = args => {
  const { name, namespace, viewType = 'list' } = args;
  const routerMap: TestContextProps['routerMap'] = {};

  if (!!name) {
    routerMap['name'] = name;
  }
  if (!!namespace) {
    routerMap['namespace'] = namespace;
  }

  return (
    <TestContext routerMap={routerMap}>
      {viewType === 'list' ? <CustomResourceDefinitionList /> : <CustomResourceDefinitionDetails />}
    </TestContext>
  );
};

export const List = Template.bind({});
List.args = {};

export const Details = Template.bind({});
Details.args = {
  viewType: 'details',
  name: 'mydefinition.phonyresources.io',
};
