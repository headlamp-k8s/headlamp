import { Meta } from '@storybook/react/types-6-0';
import VPA, { KubeVPA } from '../../lib/k8s/vpa';
import { TestContext } from '../../test';
import { generateK8sResourceList } from '../../test/mocker';
import VpaList from './List';

VPA.isEnabled = () => Promise.resolve(true);
VPA.useList = () => {
  const objList = generateK8sResourceList<KubeVPA>(
    {
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
    },
    { instantiateAs: VPA }
  );
  return [objList, null, () => {}, () => {}] as any;
};

export default {
  title: 'VPA/VPAListView',
  component: VpaList,
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
  return <VpaList />;
};

export const List = Template.bind({});
