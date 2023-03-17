import { Meta, Story } from '@storybook/react/types-6-0';
import { KubeObject } from '../../lib/k8s/cluster';
import { LimitRange } from '../../lib/k8s/limitRange';
import { TestContext } from '../../test';
import { LimitRangeList } from './List';
import { LIMIT_RANGE_DUMMY_DATA } from './storyHelper';

LimitRange.useList = () => {
  const objList = LIMIT_RANGE_DUMMY_DATA.map((data: KubeObject) => new LimitRange(data));

  return [objList, null, () => {}, () => {}] as any;
};

export default {
  title: 'LimitRange/ListView',
  component: LimitRangeList,
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

const Template: Story = () => {
  return <LimitRangeList />;
};

export const Items = Template.bind({});
