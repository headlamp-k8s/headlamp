import { configureStore } from '@reduxjs/toolkit';
import { Meta, Story } from '@storybook/react/types-6-0';
import { get } from 'lodash';
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { AppBarActionsProcessor } from '../../redux/actionButtonsSlice';
import { INITIAL_STATE as UI_INITIAL_STATE } from '../../redux/reducers/ui';
import { initialState as themeInitialState } from './themeSlice';
import { processAppBarActions, PureTopBar, PureTopBarProps } from './TopBar';

const store = configureStore({
  reducer: (state = { config: {}, ui: typeof UI_INITIAL_STATE }) => state,
  preloadedState: {
    config: {},
    ui: {
      ...UI_INITIAL_STATE,
    },
    notifications: {
      notifications: [],
    },
    plugins: {
      loaded: true,
    },
    theme: {
      ...themeInitialState,
    },
  },
});

export default {
  title: 'TopBar',
  component: PureTopBar,
  argTypes: {},
  decorators: [
    Story => {
      return (
        <MemoryRouter>
          <Provider store={store}>
            <Story />
          </Provider>
        </MemoryRouter>
      );
    },
  ],
} as Meta;

function OurTopBar(args: PropsWithChildren<PureTopBarProps>) {
  const appBarActions = [{ id: 'moo-thing', action: <p>moo</p> }];
  const appBarActionsProcessors = [
    {
      processor: ({ actions }) => {
        const newActions = actions.filter(action => action && get(action, 'id') !== 'moo-thing');
        newActions.push({ action: <p>meow</p>, id: 'meow-thing' });
        return newActions;
      },
      id: 'no-moo-processor',
    } as AppBarActionsProcessor,
  ];

  return (
    <PureTopBar
      {...args}
      appBarActions={processAppBarActions(appBarActions, appBarActionsProcessors)}
    />
  );
}

const Template: Story<PureTopBarProps> = args => {
  return <OurTopBar {...args} />;
};
export const ProcessorAction = Template.bind({});
ProcessorAction.args = {
  logout: () => {},
  hasToken: false,
};

const PureTemplate: Story<PureTopBarProps> = args => {
  return <PureTopBar {...args} />;
};

export const NoToken = PureTemplate.bind({});
NoToken.args = {
  appBarActions: [],
  logout: () => {},
  hasToken: false,
};

export const Token = PureTemplate.bind({});
Token.args = {
  appBarActions: [],
  logout: () => {},
  hasToken: true,
};

export const OneCluster = PureTemplate.bind({});
OneCluster.args = {
  appBarActions: [],
  logout: () => {},
  hasToken: true,
  cluster: 'ak8s-desktop',
  clusters: { 'ak8s-desktop': '' },
};

export const TwoCluster = PureTemplate.bind({});
TwoCluster.args = {
  appBarActions: [],
  logout: () => {},
  hasToken: true,
  cluster: 'ak8s-desktop',
  clusters: { 'ak8s-desktop': '', 'ak8s-desktop2': '' },
};
