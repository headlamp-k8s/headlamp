import { Meta, Story } from '@storybook/react/types-6-0';
import { KubeObject, KubeObjectClass } from '../../lib/k8s/cluster';
import Event from '../../lib/k8s/event';
import VPA from '../../lib/k8s/vpa';
import { TestContext } from '../../test';
import VpaDetails from './Details';

const usePhonyGet: KubeObjectClass['useGet'] = () => {
  return [
    new VPA({
      apiVersion: 'autoscaling.k8s.io/v1',
      kind: 'VerticalPodAutoscaler',
      metadata: {
        annotations: {
          'kubectl.kubernetes.io/last-applied-configuration':
            '{"apiVersion":"autoscaling.k8s.io/v1","kind":"VerticalPodAutoscaler","metadata":{"annotations":{},"name":"multi-container-vpa","namespace":"default"},"spec":{"resourcePolicy":{"containerPolicies":[{"containerName":"web-container","controlledResources":["cpu","memory"],"controlledValues":"RequestsAndLimits","minAllowed":{"cpu":"80m","memory":"512Mi"}},{"containerName":"db-container","controlledResources":["cpu","memory"],"controlledValues":"RequestsAndLimits","minAllowed":{"cpu":"1000m","memory":"2Gi"}}]},"targetRef":{"apiVersion":"apps/v1","kind":"Deployment","name":"multi-container-deployment"},"updatePolicy":{"updateMode":"Auto"}}}\n',
        },
        creationTimestamp: '2023-11-23T07:18:45Z',
        name: 'multi-container-vpa',
        namespace: 'default',
        resourceVersion: '111487',
        uid: '79cf71ba-81f4-4e7b-957d-8625c3afb0c1',
      },
      spec: {
        resourcePolicy: {
          containerPolicies: [
            {
              containerName: 'web-container',
              controlledResources: ['cpu', 'memory'],
              controlledValues: 'RequestsAndLimits',
              minAllowed: {
                cpu: '80m',
                memory: '512Mi',
              },
            },
            {
              containerName: 'db-container',
              controlledResources: ['cpu', 'memory'],
              controlledValues: 'RequestsAndLimits',
              minAllowed: {
                cpu: '1000m',
                memory: '2Gi',
              },
            },
          ],
        },
        targetRef: {
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          name: 'multi-container-deployment',
        },
        updatePolicy: {
          updateMode: 'Auto',
        },
      },
      status: {
        conditions: [
          {
            lastTransitionTime: '2023-11-23T07:18:48Z',
            status: 'True',
            type: 'RecommendationProvided',
          },
        ],
        recommendation: {
          containerRecommendations: [
            {
              containerName: 'db-container',
              lowerBound: {
                cpu: '1',
                memory: '2Gi',
              },
              target: {
                cpu: '1',
                memory: '2Gi',
              },
              uncappedTarget: {
                cpu: '12m',
                memory: '131072k',
              },
              upperBound: {
                cpu: '1',
                memory: '2Gi',
              },
            },
            {
              containerName: 'web-container',
              lowerBound: {
                cpu: '80m',
                memory: '512Mi',
              },
              target: {
                cpu: '80m',
                memory: '512Mi',
              },
              uncappedTarget: {
                cpu: '12m',
                memory: '131072k',
              },
              upperBound: {
                cpu: '80m',
                memory: '512Mi',
              },
            },
          ],
        },
      },
    }),
  ] as any;
};

export default {
  title: 'VPA/VPADetailsView',
  component: VpaDetails,
  argTypes: {},
  decorators: [
    Story => {
      return (
        <TestContext routerMap={{ namespace: 'default', name: 'multi-container-vpa' }}>
          <Story />
        </TestContext>
      );
    },
  ],
} as Meta;

interface MockerStory {
  useGet?: KubeObjectClass['useGet'];
  useList?: KubeObjectClass['useList'];
}

const Template: Story = (args: MockerStory) => {
  if (!!args.useGet) {
    VPA.useGet = args.useGet;
    Event.objectEvents = async (obj: KubeObject) => {
      console.log('objectEvents', obj);
      return [];
    };
  }
  return <VpaDetails />;
};

export const Default = Template.bind({});
Default.args = {
  useGet: usePhonyGet,
};

export const NoItemYet = Template.bind({});
NoItemYet.args = {
  useGet: () => [null, null, () => {}, () => {}] as any,
};

export const Error = Template.bind({});
Error.args = {
  useGet: () => [null, 'Phony error is phony!', () => {}, () => {}] as any,
};
