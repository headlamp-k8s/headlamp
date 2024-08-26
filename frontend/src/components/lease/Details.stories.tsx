import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import { LeaseDetails } from './Details';
import { LEASE_DUMMY_DATA } from './storyHelper';

export default {
  title: 'Lease/LeaseDetailsView',
  component: LeaseDetails,
  argTypes: {},
  decorators: [
    Story => {
      return (
        <TestContext routerMap={{ name: 'my-lease' }}>
          <Story />
        </TestContext>
      );
    },
  ],
} as Meta;

const Template: StoryFn = () => {
  return <LeaseDetails />;
};

export const LeaseDetail = Template.bind({});
LeaseDetail.parameters = {
  msw: {
    handlers: {
      storyBase: [],
      story: [
        http.get('http://localhost:4466/apis/coordination.k8s.io/v1/leases/my-lease', () =>
          HttpResponse.json(LEASE_DUMMY_DATA[0])
        ),
        http.get('http://localhost:4466/apis/coordination.k8s.io/v1/leases', () =>
          HttpResponse.error()
        ),
        http.get('http://localhost:4466/api/v1/namespaces/default/events', () =>
          HttpResponse.json({
            kind: 'EventList',
            items: [],
            metadata: {},
          })
        ),
      ],
    },
  },
};
