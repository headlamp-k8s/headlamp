import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ContextMenu, ContextMenuProps } from './index';

export default {
  title: 'ContextMenu',
  component: ContextMenu,
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as Meta;

const Template: StoryFn<ContextMenuProps> = args => <ContextMenu {...args} />;

export const OpenMenu = Template.bind({});
OpenMenu.args = {
  detailsLink: 'https://headlamp.dev/',
};
