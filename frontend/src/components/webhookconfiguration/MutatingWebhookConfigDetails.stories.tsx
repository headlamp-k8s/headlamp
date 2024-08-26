import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import MutatingWebhookConfigDetails from './MutatingWebhookConfigDetails';
import { createMWC } from './storyHelper';

export default {
  title: 'WebhookConfiguration/MutatingWebhookConfig/Details',
  component: MutatingWebhookConfigDetails,
  argTypes: {},
  decorators: [
    Story => {
      return <Story />;
    },
  ],
  parameters: {
    msw: {
      handlers: {
        storyBase: [
          http.get(
            'http://localhost:4466/apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations',
            () => HttpResponse.error()
          ),
        ],
      },
    },
  },
} as Meta;

const Template: StoryFn = () => {
  return (
    <TestContext routerMap={{ name: 'my-mwc' }}>
      <MutatingWebhookConfigDetails />;
    </TestContext>
  );
};

export const WithService = Template.bind({});

WithService.parameters = {
  msw: {
    handlers: {
      story: [
        http.get(
          'http://localhost:4466/apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations/my-mwc',
          () => HttpResponse.json(createMWC(true))
        ),
      ],
    },
  },
};

export const WithURL = Template.bind({});

WithURL.parameters = {
  msw: {
    handlers: {
      story: [
        http.get(
          'http://localhost:4466/apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations/my-mwc',
          () => HttpResponse.json(createMWC(false))
        ),
      ],
    },
  },
};
