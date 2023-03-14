import { Meta } from '@storybook/react';
import { Lease } from '../../lib/k8s/lease';
import { TestContext } from '../../test';
import { LeaseDetails } from './Details';
import { LEASE_DUMMY_DATA } from './storyHelper';

Lease.useGet = () => [new Lease(LEASE_DUMMY_DATA[0]), null, () => {}, () => {}] as any;

export default {
  title: 'Lease/LeaseDetailsView',
  component: LeaseDetails,
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
  return <LeaseDetails />;
};

export const LeaseDetail = Template.bind({});
