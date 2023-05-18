import { Meta } from '@storybook/react';
import { TestContext } from '../../test';
import VolumeClaimDetails from './ClaimDetails';

export default {
  title: 'storage/VolumeClaimDetails',
  component: VolumeClaimDetails,
  argTypes: {},
  decorators: [
    Story => {
      return (
        <TestContext>
          <Story />
        </TestContext>
      );
    },
  ],
} as Meta;

const Template = () => {
  return <VolumeClaimDetails />;
};

export const ClaimDetail = Template.bind({});
