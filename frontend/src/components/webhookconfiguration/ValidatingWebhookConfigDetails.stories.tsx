import { Meta, Story } from '@storybook/react/types-6-0';
import VWC, {
  KubeValidatingWebhookConfiguration,
} from '../../lib/k8s/validatingWebhookConfiguration';
import { TestContext } from '../../test';
import ValidatingWebhookConfigDetails from './ValidatingWebhooksConfigDetails';

const usePhonyGet: KubeValidatingWebhookConfiguration['useGet'] = (withService: boolean) => {
  return [
    new VWC({
      apiVersion: 'admissionregistration.k8s.io/v1',
      kind: 'ValidatingWebhookConfiguration',
      metadata: {
        creationTimestamp: '2022-10-14T11:25:22Z',
        generation: 1,
        labels: {
          'admissions.enforcer/disabled': 'true',
        },
        name: 'my-validating-webhook',
        resourceVersion: '123',
        uid: '123-abc',
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
                    path: '/validate-nodes',
                  },
                }
              : {
                  url: 'https://localhost:8443/validate-nodes',
                }),
          },
          failurePolicy: 'Fail',
          matchPolicy: 'Equivalent',
          name: 'my-node-validating-webhook.example.com',
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
          rules: [
            {
              apiGroups: [''],
              apiVersions: ['v1'],
              operations: ['UPDATE'],
              resources: ['nodes'],
              scope: '*',
            },
          ],
          sideEffects: 'NoneOnDryRun',
          timeoutSeconds: 5,
        },
      ],
    }),
    null,
    () => {},
    () => {},
  ] as any;
};

export default {
  title: 'WebhookConfiguration/ValidatingWebhookConfig/Details',
  component: ValidatingWebhookConfigDetails,
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

  VWC.useGet = () => usePhonyGet(withService);

  return (
    <TestContext>
      <ValidatingWebhookConfigDetails />;
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
