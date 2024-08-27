import Container from '@mui/material/Container';
import { Meta, StoryFn } from '@storybook/react';
import { TestContext } from '../../test';
import List from './List';

export default {
  title: 'node/List',
  component: List,
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
    <Container maxWidth="xl">
      <List />
    </Container>
  );
};

export const Nodes = Template.bind({});
