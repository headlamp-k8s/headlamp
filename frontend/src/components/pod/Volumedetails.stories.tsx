import { Meta, Story } from '@storybook/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import store from '../../redux/stores/store';
import { VolumeDetails as PodVolumeDetails, VolumeDetailsProps } from './Details';

export default {
  title: 'pods/VolumeDetails',
  component: PodVolumeDetails,
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

const Template: Story<VolumeDetailsProps> = args => <PodVolumeDetails {...args} />;

export const VolumeDetails = Template.bind({});

VolumeDetails.args = {
  volumes: [
    {
      name: 'Dummy_Volume',
      configMap: {
        name: 'Dummy_Name',
        items: [
          {
            key: 'Corefile',
            path: 'Corefile',
          },
        ],
        defaultMode: 420,
      },
    },
    {
      name: 'random_name',
      secret: {
        secretName: 'dsadsa',
        defaultMode: 420,
      },
    },
  ],
};
