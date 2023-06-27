import { Meta } from '@storybook/react';
import { TestContext } from '../../test';
import Details from './Details';

export default {
  title: 'serviceaccount/Details',
  component: Details,
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
  return <Details />;
};

export const Detail = Template.bind({});
