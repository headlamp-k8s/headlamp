import { Meta, Story } from '@storybook/react';
import HPA, { KubeHPA } from '../../lib/k8s/hpa';
import { TestContext } from '../../test';
import { generateK8sResourceList } from '../../test/mocker';
import HpaList from './List';

HPA.useList = () => {
  const objList = generateK8sResourceList<KubeHPA>(
    {
      kind: 'HorizontalPodAutoscaler',
      metadata: {
        annotations: {
          'kubectl.kubernetes.io/last-applied-configuration':
            '{"apiVersion":"autoscaling/v2","kind":"HorizontalPodAutoscaler","metadata":{"annotations":{},"creationTimestamp":"2022-10-17T08:04:30Z","name":"php-apache","namespace":"default","resourceVersion":"4488138","uid":"a98be011-f69e-404a-bcfa-d76d78d24884"},"spec":{"maxReplicas":10,"metrics":[{"resource":{"name":"cpu","target":{"averageUtilization":50,"type":"Utilization"}},"type":"Resource"},{"resource":{"name":"memory","target":{"averageValue":"100Mi","type":"AverageValue"}},"type":"Resource"}],"minReplicas":1,"scaleTargetRef":{"apiVersion":"apps/v1","kind":"Deployment","name":"php-apache"}},"status":{"conditions":[{"lastTransitionTime":"2022-10-17T08:04:45Z","message":"recommended size matches current size","reason":"ReadyForNewScale","status":"True","type":"AbleToScale"},{"lastTransitionTime":"2022-10-17T21:57:14Z","message":"the HPA was able to successfully calculate a replica count from cpu resource utilization (percentage of request)","reason":"ValidMetricFound","status":"True","type":"ScalingActive"},{"lastTransitionTime":"2022-10-20T10:11:08Z","message":"the desired replica count is less than the minimum replica count","reason":"TooFewReplicas","status":"True","type":"ScalingLimited"}],"currentMetrics":[{"resource":{"current":{"averageUtilization":0,"averageValue":"1m"},"name":"cpu"},"type":"Resource"}],"currentReplicas":1,"desiredReplicas":1,"lastScaleTime":"2022-10-20T10:11:08Z"}}\n',
        },
        creationTimestamp: '2022-10-20T11:10:58Z',
        name: 'php-apache',
        namespace: 'default',
        resourceVersion: '6462096',
        uid: '73ad9a26-7cbd-431b-801a-614c9cbbd285',
      },
      spec: {
        maxReplicas: 10,
        metrics: [
          {
            resource: {
              name: 'memory',
              target: {
                averageValue: '100Mi',
                type: 'AverageValue',
              },
            },
            type: 'Resource',
          },
          {
            resource: {
              name: 'cpu',
              target: {
                averageUtilization: 50,
                type: 'Utilization',
              },
            },
            type: 'Resource',
          },
        ],
        minReplicas: 1,
        scaleTargetRef: {
          apiVersion: 'apps/v1',
          kind: 'Deployment',
          name: 'php-apache',
        },
      },
      status: {
        conditions: [
          {
            lastTransitionTime: '2022-10-20T11:11:01Z',
            message: "the HPA controller was able to get the target's current scale",
            reason: 'SucceededGetScale',
            status: 'True',
            type: 'AbleToScale',
          },
          {
            lastTransitionTime: '2022-10-26T12:53:22Z',
            message:
              'the HPA was unable to compute the replica count: failed to get memory utilization: unable to get metrics for resource memory: no metrics returned from resource metrics API',
            reason: 'FailedGetResourceMetric',
            status: 'False',
            type: 'ScalingActive',
          },
          {
            lastTransitionTime: '2022-10-20T11:11:01Z',
            message: 'the desired count is within the acceptable range',
            reason: 'DesiredWithinRange',
            status: 'False',
            type: 'ScalingLimited',
          },
        ],
        currentMetrics: [
          {
            resource: {
              current: {
                averageValue: '14360576',
              },
              name: 'memory',
            },
            type: 'Resource',
          },
          {
            resource: {
              current: {
                averageUtilization: 0,
                averageValue: '1m',
              },
              name: 'cpu',
            },
            type: 'Resource',
          },
        ],
        currentReplicas: 1,
        desiredReplicas: 1,
        lastScaleTime: '2022-10-21T11:15:12Z',
      },
    },
    { instantiateAs: HPA }
  );
  return [objList, null, () => {}, () => {}] as any;
};

export default {
  title: 'hpa/HpaListView',
  component: HpaList,
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

const Template: Story = () => {
  return <HpaList />;
};

export const Items = Template.bind({});
