import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import { createVWC } from './storyHelper';
import ValidatingWebhookConfigDetails from './ValidatingWebhookConfigDetails';

export default {
  title: 'WebhookConfiguration/ValidatingWebhookConfig/Details',
  component: ValidatingWebhookConfigDetails,
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
            'http://localhost:4466/apis/admissionregistration.k8s.io/v1/validatingwebhookconfigurations',
            () => HttpResponse.error()
          ),
        ],
      },
    },
  },
} as Meta;

const Template: StoryFn = () => {
  return (
    <TestContext routerMap={{ name: 'my-vwc' }}>
      <ValidatingWebhookConfigDetails />;
    </TestContext>
  );
};

export const WithService = Template.bind({});
WithService.args = {
  withService: true,
};
WithService.parameters = {
  msw: {
    handlers: {
      story: [
        http.get(
          'http://localhost:4466/apis/admissionregistration.k8s.io/v1/validatingwebhookconfigurations/my-vwc',
          () => HttpResponse.json(createVWC(true))
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
          'http://localhost:4466/apis/admissionregistration.k8s.io/v1/validatingwebhookconfigurations/my-vwc',
          () => HttpResponse.json(createVWC(false))
        ),
      ],
    },
  },
};
