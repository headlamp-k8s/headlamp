import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { KubeObjectClass } from '../../lib/k8s/cluster';
import { TestContext, TestContextProps } from '../../test';
import CustomResourceList from './CustomResourceList';
import { mockCRD, mockCRList } from './storyHelper';

interface MockerStory {
  useApiGet?: KubeObjectClass['useApiGet'];
  useGet?: KubeObjectClass['useGet'];
  routerParams?: TestContextProps['routerMap'];
}

export default {
  title: 'crd/CustomResourceList',
  argTypes: {},
  decorators: [Story => <Story />],
  parameters: {
    msw: {
      handlers: {
        storyBase: [
          http.get('http://localhost:4466/apis/my.phonyresources.io/v1/mycustomresources', () =>
            HttpResponse.json({
              kind: 'List',
              metadata: {},
              items: mockCRList,
            })
          ),
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
        ],
      },
    },
  },
} as Meta;

const Template: StoryFn<MockerStory> = args => {
  const { routerParams = {} } = args;
  const routerMap: TestContextProps['routerMap'] = routerParams;

  return (
    <TestContext routerMap={routerMap}>
      <CustomResourceList />
    </TestContext>
  );
};

export const List = Template.bind({});
List.args = {
  routerParams: {
    crd: 'mydefinition.phonyresources.io',
  },
};
