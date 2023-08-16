import { Meta, Story } from '@storybook/react/types-6-0';
import MWC, { KubeMutatingWebhookConfiguration } from '../../lib/k8s/mutatingWebhookConfiguration';
import { TestContext } from '../../test';
import MutatingWebhookConfigDetails from './MutatingWebhooksConfigDetails';

const usePhonyGet: KubeMutatingWebhookConfiguration['useGet'] = (withService: boolean) => {
  return [
    new MWC({
      apiVersion: 'admissionregistration.k8s.io/v1',
      kind: 'MutatingWebhookConfiguration',
      metadata: {
        creationTimestamp: '2022-10-14T11:25:22Z',
        generation: 1,
        labels: {
          'admissions.enforcer/disabled': 'true',
        },
        name: 'webhook-admission-controller',
        resourceVersion: '123',
        uid: '123-abcd',
      },
      webhooks: [
        {
          admissionReviewVersions: ['v1beta1'],
          clientConfig: {
            caBundle: 'dGhpcy1pcy1hLXRlc3QK',
            ...(withService
              ? {
                  service: {
                    name: 'my-service',
                    namespace: 'my-namespace',
                    path: '/mutate-nodes',
                  },
                }
              : {
                  url: 'https://localhost:8443/mutate-nodes',
                }),
          },
          failurePolicy: 'Fail',
          matchPolicy: 'Exact',
          name: 'webhook-admission-controller.example.com',
          namespaceSelector: {
            matchExpressions: [
              {
                key: 'validating-webhook',
                operator: 'In',
                values: ['true'],
              },
            ],
            matchLabels: {
              'validating-webhook': 'true',
            },
          },
          objectSelector: {
            matchExpressions: [
              {
                key: 'validating-webhook',
                operator: 'In',
                values: ['true'],
              },
            ],
            matchLabels: {
              'validating-webhook': 'true',
            },
          },
          reinvocationPolicy: 'Never',
          rules: [
            {
              apiGroups: [''],
              apiVersions: ['v1'],
              operations: ['CREATE'],
              resources: ['pods'],
              scope: '*',
            },
          ],
          sideEffects: 'NoneOnDryRun',
          timeoutSeconds: 10,
        },
      ],
    }),
    null,
    () => {},
    () => {},
  ] as any;
};

export default {
  title: 'WebhookConfiguration/MutatingWebhookConfig/Details',
  component: MutatingWebhookConfigDetails,
  argTypes: {},
  decorators: [
    Story => {
      return <Story />;
    },
  ],
} as Meta;

interface MockerStory {
  withService: boolean;
}

const Template: Story<MockerStory> = args => {
  const { withService } = args;

  MWC.useGet = () => usePhonyGet(withService);

  return (
    <TestContext>
      <MutatingWebhookConfigDetails />;
    </TestContext>
  );
};

export const WithService = Template.bind({});
WithService.args = {
  withService: true,
};

export const WithURL = Template.bind({});
WithURL.args = {
  withService: false,
};
