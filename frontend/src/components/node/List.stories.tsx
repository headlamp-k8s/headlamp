import Container from '@mui/material/Container';
import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import List from './List';
import { NODE_DUMMY_DATA } from './storyHelper';

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
  parameters: {
    msw: {
      handlers: {
        story: [
          http.get('http://localhost:4466/api/v1/nodes', () =>
            HttpResponse.json({
              kind: 'NodeList',
              apiVersion: 'v1',
              metadata: {},
              items: NODE_DUMMY_DATA,
            })
          ),
        ],
      },
    },
  },
} as Meta;

const Template: StoryFn = () => {
  return (
    <Container maxWidth="xl">
      <List />
    </Container>
  );
};

export const Nodes = Template.bind({});
