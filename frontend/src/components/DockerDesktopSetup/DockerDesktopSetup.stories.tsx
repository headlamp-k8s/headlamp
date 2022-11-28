import { Meta, Story } from '@storybook/react/types-6-0';
import { Provider } from 'react-redux';
import defaultStore from '../../redux/stores/store';
import { PureDockerDesktopSetup, PureDockerDesktopSetupProps } from './DockerDesktopSetup';

export default {
  title: 'DockerDesktopSetup',
  component: PureDockerDesktopSetup,
  argTypes: {
    onDone: { action: 'done clicked' },
  },
  decorators: [
    Story => {
      return (
        <Provider store={defaultStore}>
          <Story />
        </Provider>
      );
    },
  ],
} as Meta;

const Template: Story<PureDockerDesktopSetupProps> = args => <PureDockerDesktopSetup {...args} />;

export const DockerDesktopDefault = Template.bind({});
DockerDesktopDefault.args = {};
