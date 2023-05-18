import { Meta } from '@storybook/react';
import { TestContext } from '../../test';
import ServiecDetails from './Details';

export default {
  title: 'network/ServiceDetails',
  component: ServiecDetails,
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
  return <ServiecDetails />;
};

export const ServiceDetail = Template.bind({});
