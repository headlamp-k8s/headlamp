import { Meta } from '@storybook/react';
import { TestContext } from '../../test';
import { RuntimeClassDetails } from './Details';

export default {
  title: 'RuntimeClass/DetailsView',
  component: RuntimeClassDetails,
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

const Template = () => {
  return <RuntimeClassDetails />;
};

export const RuntimeClassDetail = Template.bind({});
