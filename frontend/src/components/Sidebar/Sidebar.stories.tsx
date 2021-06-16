import { Meta, Story } from '@storybook/react/types-6-0';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import prepareRoutes from './prepareRoutes';
import { PureSidebar, PureSidebarProps } from './Sidebar';

export default {
  title: 'Sidebar/Sidebar',
  component: PureSidebar,
  argTypes: {
    dispatch: { action: 'dispatch' },
  },
  decorators: [
    Story => (
      <MemoryRouter>
        <SnackbarProvider>
          <Story />
        </SnackbarProvider>
      </MemoryRouter>
    ),
  ],
} as Meta;

const Template: Story<PureSidebarProps> = args => {
  const [open, setOpenConfirm] = React.useState(args.open);

  return <PureSidebar {...args} open={open} onToggleOpen={() => setOpenConfirm(!open)} />;
};

const items = prepareRoutes();

export const Open = Template.bind({});
Open.args = {
  open: true,
  items: items,
  selectedName: 'cluster',
};
export const Closed = Template.bind({});
Closed.args = {
  open: false,
  items: items,
  selectedName: 'cluster',
};
