import { Meta, StoryFn } from '@storybook/react';
import Pod from '../../../lib/k8s/pod';
import { TestContext } from '../../../test';
import { generateK8sResourceList } from '../../../test/mocker';
import { podList } from '../../pod/storyHelper';
import ResourceListView from './ResourceListView';

const phonyPods = generateK8sResourceList(podList[0], { instantiateAs: Pod });

export default {
  title: 'Resource/ListView',
  component: ResourceListView,
  argTypes: {},
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

const Template: StoryFn = () => {
  return (
    <ResourceListView
      title="My Pod List"
      data={phonyPods}
      columns={[
        'name',
        'namespace',
        {
          label: 'Num Containers',
          getValue: item => item?.spec.containers.length,
          show: false,
        },
        'age',
      ]}
    />
  );
};

export const OneHiddenColumn = Template.bind({});
