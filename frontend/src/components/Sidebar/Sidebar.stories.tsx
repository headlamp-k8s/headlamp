import { configureStore } from '@reduxjs/toolkit';
import { Meta, Story } from '@storybook/react/types-6-0';
import { SnackbarProvider } from 'notistack';
import { INITIAL_STATE } from '../../redux/reducers/config';
import { INITIAL_STATE as FILTER_INITIAL_STATE } from '../../redux/reducers/filter';
import { INITIAL_STATE as UI_INITIAL_STATE, UIState } from '../../redux/reducers/ui';
import { TestContext } from '../../test';
import Sidebar, { DefaultSidebars, PureSidebar } from './Sidebar';

export default {
  title: 'Sidebar/Sidebar',
  component: PureSidebar,
  argTypes: {
    dispatch: { action: 'dispatch' },
  },
} as Meta;

type StoryProps = Partial<UIState['sidebar']>;

const Template: Story<StoryProps> = args => {
  const sidebarStore = configureStore({
    reducer: (
      state = {
        ui: { ...UI_INITIAL_STATE },
      }
    ) => state,
    preloadedState: {
      plugins: {
        loaded: true,
      },
      config: {
        ...INITIAL_STATE,
      },
      filter: {
        ...FILTER_INITIAL_STATE,
      },
      ui: {
        ...UI_INITIAL_STATE,
        sidebar: {
          ...UI_INITIAL_STATE.sidebar,
          isVisible: true,
          ...args,
        },
      },
    },
  });

  return (
    <TestContext store={sidebarStore}>
      <SnackbarProvider>
        <Sidebar />
      </SnackbarProvider>
    </TestContext>
  );
};

export const InClusterSidebarOpen = Template.bind({});
InClusterSidebarOpen.args = {
  isSidebarOpen: true,
  selected: {
    item: 'cluster',
    sidebar: DefaultSidebars.IN_CLUSTER,
  },
};
export const InClusterSidebarClosed = Template.bind({});
InClusterSidebarClosed.args = {
  isSidebarOpen: false,
  selected: {
    item: 'cluster',
    sidebar: DefaultSidebars.IN_CLUSTER,
  },
};
export const NoSidebar = Template.bind({});
NoSidebar.args = {
  selected: {
    item: null,
    sidebar: null,
  },
};
export const SelectedItemWithSidebarOmitted = Template.bind({});
SelectedItemWithSidebarOmitted.args = {
  selected: {
    item: 'workloads',
    // This is what happens internally when plugins only set a selected name, not a selected sidebar.
    // i.e. it will use the in-cluster sidebar by default.
    sidebar: '',
  },
};
export const HomeSidebarOpen = Template.bind({});
HomeSidebarOpen.args = {
  selected: {
    item: 'settings',
    sidebar: DefaultSidebars.HOME,
  },
};
export const HomeSidebarClosed = Template.bind({});
HomeSidebarClosed.args = {
  isSidebarOpen: false,
  selected: {
    item: 'settings',
    sidebar: DefaultSidebars.HOME,
  },
};
export const NotVisibleSidebar = Template.bind({});
NotVisibleSidebar.args = {
  isVisible: false,
  selected: {
    item: 'settings',
    sidebar: DefaultSidebars.HOME,
  },
};
