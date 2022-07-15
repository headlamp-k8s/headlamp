import { Meta, Story } from '@storybook/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import Pod from '../../lib/k8s/pod';
import store from '../../redux/stores/store';
import { PodListProps, PodListRenderer } from './List';

export default {
  title: 'pods/PodListRenderer',
  component: PodListRenderer,
  decorators: [
    Story => (
      <MemoryRouter>
        <Provider store={store}>
          <Story />
        </Provider>
      </MemoryRouter>
    ),
  ],
} as Meta;

const Template: Story<PodListProps> = args => <PodListRenderer {...args} />;

export const Pods = Template.bind({});

Pods.args = {
  pods: [
    new Pod({
      kind: 'Pod',
      status: {
        conditions: [],
        containerStatuses: [],
        hostIP: 'https://',
        message: 'Dummy_Message',
        qosClass: '',
        startTime: 21,
        reason: '',
        phase: '',
      },
      spec: {
        containers: [],
        nodeName: 'Dummy_Node',
      },
      metadata: {
        uid: 'Dummy_UID',
        resourceVersion: 'v1',
        creationTimestamp: new Date(),
        selfLink: 'https://',
        name: 'Dummy_POD',
        namespace: 'Dummy_Namespace',
      },
    }),
  ],
};
