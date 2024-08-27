import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import { LeaseList } from './List';
import { LEASE_DUMMY_DATA } from './storyHelper';

const objList = LEASE_DUMMY_DATA;

export default {
  title: 'Lease/ListView',
  component: LeaseList,
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
  parameters: {
    msw: {
      handlers: {
        story: [
          http.get('http://localhost:4466/apis/coordination.k8s.io/v1/leases', () =>
            HttpResponse.json({
              kind: 'LeaseList',
              metadata: {},
              items: objList,
            })
          ),
        ],
      },
    },
  },
} as Meta;

const Template: StoryFn = () => {
  return <LeaseList />;
};

export const Items = Template.bind({});
