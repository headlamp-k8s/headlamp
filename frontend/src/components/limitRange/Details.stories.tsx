import { Meta, Story } from '@storybook/react/types-6-0';
import { LimitRange } from '../../lib/k8s/limitRange';
import { TestContext } from '../../test';
import { LimitRangeDetails } from './Details';
import { LIMIT_RANGE_DUMMY_DATA } from './storyHelper';

LimitRange.useGet = () =>
  [new LimitRange(LIMIT_RANGE_DUMMY_DATA[0]), null, () => {}, () => {}] as any;

export default {
  title: 'LimitRange/DetailsView',
  component: LimitRangeDetails,
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
  return <LimitRangeDetails />;
};

export const LimitRangeDetail = Template.bind({});
