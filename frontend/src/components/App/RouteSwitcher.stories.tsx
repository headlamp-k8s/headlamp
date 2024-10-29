import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { Route } from '../../lib/router';
import { setRoute } from '../../redux/routesSlice';
import store from '../../redux/stores/store';
import { TestContext } from '../../test';
import { DefaultSidebars } from '../Sidebar';
import RouteSwitcher from './RouteSwitcher';

const storyData = {
  title: 'routes/RouteSwitcher',
  component: RouteSwitcher,
  argTypes: {},
} as Meta;
export default storyData;

const Template: StoryFn<{ route: Route }> = args => {
  const { route } = args;

  React.useEffect(() => {
    store.dispatch(setRoute(route));
  }, []);

  return (
    <TestContext store={store} urlPrefix={route.path}>
      <RouteSwitcher requiresToken={() => false} />
    </TestContext>
  );
};

export const Default = Template.bind({});
Default.args = {
  route: {
    path: '/test',
    component: () => {
      throw { message: 'Oh no! I just crashed!', stack: 'Here is the stack trace' };
    },
    useClusterURL: false,
    noAuthRequired: true,
    name: 'My Test Route',
    sidebar: {
      item: 'home',
      sidebar: DefaultSidebars.HOME,
    },
  },
};
