import { Meta } from '@storybook/react';
import { TestContext } from '../../test';
import ClassDetails from './ClassDetails';

export default {
  title: 'storage/ClassDetails',
  component: ClassDetails,
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
  return <ClassDetails />;
};

export const ClassDetail = Template.bind({});
