import { Meta, StoryFn } from '@storybook/react';
import { TestContext } from '../../test';
import NamespacesList from './List';

export default {
  title: 'Namespace/ListView',
  component: NamespacesList,
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
  return <NamespacesList />;
};

export const Regular = Template.bind({});
