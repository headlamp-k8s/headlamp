import { Meta, Story } from '@storybook/react/types-6-0';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from '../../redux/stores/store';
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
  const { t } = useTranslation();
  const items = prepareRoutes(t);

  return (
    <Provider store={store}>
      <PureSidebar {...args} items={items} open={open} onToggleOpen={() => setOpenConfirm(!open)} />
    </Provider>
  );
};

export const Open = Template.bind({});
Open.args = {
  open: true,
  selectedName: 'cluster',
};
export const Closed = Template.bind({});
Closed.args = {
  open: false,
  selectedName: 'cluster',
};
