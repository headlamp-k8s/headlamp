import { Meta, Story } from '@storybook/react/types-6-0';
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

const Template: Story<ContextMenuProps> = args => <ContextMenu {...args} />;

export const OpenMenu = Template.bind({});
OpenMenu.args = {
  detailsLink: 'https://headlamp.dev/',
};
