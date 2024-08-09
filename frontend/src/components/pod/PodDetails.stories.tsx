import { Meta, Story } from '@storybook/react';
import { KubeObjectClass } from '../../lib/k8s/cluster';
import Event from '../../lib/k8s/event';
import Pod, { KubePod } from '../../lib/k8s/pod';
import { TestContext } from '../../test';
import PodDetails from './Details';
import { podList } from './storyHelper';

const usePhonyQuery: KubeObjectClass['useQuery'] = ({ name, namespace }: any): any => {
  return {
    data: new Pod(
      podList.find(
        pod => pod.metadata.name === name && pod.metadata.namespace === namespace
      ) as KubePod
    ),
    error: null,
  };
};

export default {
  title: 'Pod/PodDetailsView',
  component: PodDetails,
  argTypes: {},
  decorators: [
    Story => {
      return <Story />;
    },
  ],
} as Meta;

interface MockerStory {
  usePhonyQuery?: KubeObjectClass['usePhonyQuery'];
  objectEventsFunc?: typeof Event.objectEvents;
  podName: string;
}

const Template: Story<MockerStory> = args => {
  const { usePhonyQuery, podName, objectEventsFunc } = args;

  if (!!usePhonyQuery) {
    Pod.useQuery = args.usePhonyQuery!;
  }

  if (!!objectEventsFunc) {
    Event.objectEvents = objectEventsFunc!;
  }

  return (
    <TestContext
      routerMap={{ namespace: 'default', name: podName }}
      withObjectEvents={!objectEventsFunc}
    >
      <PodDetails />;
    </TestContext>
  );
};

export const PullBackOff = Template.bind({});
PullBackOff.args = {
  usePhonyQuery: usePhonyQuery,
  podName: 'imagepullbackoff',
};

export const Running = Template.bind({});
Running.args = {
  usePhonyQuery: usePhonyQuery,
  podName: 'running',
};

export const Error = Template.bind({});
Error.args = {
  usePhonyQuery: usePhonyQuery,
  podName: 'terminated',
  objectEventsFunc: () =>
    Promise.resolve([
      {
        apiVersion: 'v1',
        kind: 'Event',
        metadata: {
          name: 'nginx-deployment-12346',
          namespace: 'default',
          creationTimestamp: '2024-02-12T20:07:10Z',
          uid: 'abc123456',
          resourceVersion: '1',
        },
        involvedObject: {
          kind: 'Pod',
          name: 'nginx-deployment-abcd-1234567890',
          namespace: 'default',
          uid: 'b1234',
        },
        reason: 'FailedGetResourceMetric',
        message: 'failed to get cpu utilization: missing request for cpu',
        source: {
          component: 'horizontal-pod-autoscaler',
        },
        firstTimestamp: null,
        lastTimestamp: null,
        type: 'Warning',
        series: {
          count: 10,
          lastObservedTime: '2024-02-13T15:42:17Z',
        },
        reportingComponent: '',
        reportingInstance: '',
      },
    ]),
};

export const LivenessFailed = Template.bind({});
LivenessFailed.args = {
  usePhonyQuery: usePhonyQuery,
  podName: 'liveness-http',
};

export const Initializing = Template.bind({});
Initializing.args = {
  usePhonyQuery: usePhonyQuery,
  podName: 'initializing',
};

export const Successful = Template.bind({});
Successful.args = {
  usePhonyQuery: usePhonyQuery,
  podName: 'successful',
};
