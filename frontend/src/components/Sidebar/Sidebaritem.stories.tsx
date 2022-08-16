import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from '../../redux/stores/store';
import SidebarItem, { SidebarItemProps } from './SidebarItem';

export default {
  title: 'Sidebar/SidebarItem',
  component: SidebarItem,
  argTypes: {},
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as Meta;

const Template: Story<SidebarItemProps> = args => {
  return (
    <Provider store={store}>
      <Grid item style={{ backgroundColor: 'rgba(0, 0, 0, 0.87)' }}>
        <List>
          <SidebarItem {...args} />
        </List>
      </Grid>
    </Provider>
  );
};

export const Selected = Template.bind({});
Selected.args = {
  selectedName: 'cluster',
  name: 'cluster',
  label: 'Cluster',
  icon: 'mdi:hexagon-multiple-outline',
  fullWidth: true,
};

export const Unselected = Template.bind({});
Unselected.args = {
  selectedName: 'meow',
  name: 'cluster',
  label: 'Cluster',
  icon: 'mdi:hexagon-multiple-outline',
  fullWidth: true,
};

export const SublistExpanded = Template.bind({});
SublistExpanded.args = {
  selectedName: 'cluster',
  name: 'cluster',
  label: 'Cluster',
  fullWidth: true,
  icon: 'mdi:hexagon-multiple-outline',
  subList: [
    {
      selectedName: 'cluster',
      name: 'namespaces',
      label: 'Namespaces',
      hasParent: true,
    },
  ],
};

export const Sublist = Template.bind({});
Sublist.args = {
  selectedName: 'meow',
  name: 'cluster',
  label: 'Cluster',
  fullWidth: true,
  icon: 'mdi:hexagon-multiple-outline',
  subList: [
    {
      selectedName: 'cluster',
      name: 'namespaces',
      label: 'Namespaces',
      hasParent: true,
    },
  ],
};
