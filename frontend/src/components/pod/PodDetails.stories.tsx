import { Meta, Story } from '@storybook/react';
import { KubeObjectClass } from '../../lib/k8s/cluster';
import Event from '../../lib/k8s/event';
import Pod, { KubePod } from '../../lib/k8s/pod';
import { TestContext } from '../../test';
import PodDetails from './Details';
import { podList } from './storyHelper';

const usePhonyGet: KubeObjectClass['useGet'] = (name, namespace) => {
  return [
    new Pod(
      podList.find(
        pod => pod.metadata.name === name && pod.metadata.namespace === namespace
      ) as KubePod
    ),
    null,
    () => {},
    () => {},
  ] as any;
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
  useGet?: KubeObjectClass['useGet'];
  useList?: KubeObjectClass['useList'];
  objectEventsFunc?: typeof Event.objectEvents;
  podName: string;
}

const Template: Story<MockerStory> = args => {
  const { useGet, useList, podName, objectEventsFunc } = args;

  if (!!useGet) {
    Pod.useGet = args.useGet!;
  }
  if (!!useList) {
    Pod.useList = args.useList!;
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
  useGet: usePhonyGet,
  podName: 'imagepullbackoff',
};

export const Running = Template.bind({});
Running.args = {
  useGet: usePhonyGet,
  podName: 'running',
};

export const Error = Template.bind({});
Error.args = {
  useGet: usePhonyGet,
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
  useGet: usePhonyGet,
  podName: 'liveness-http',
};

export const Initializing = Template.bind({});
Initializing.args = {
  useGet: usePhonyGet,
  podName: 'initializing',
};

export const Successful = Template.bind({});
Successful.args = {
  useGet: usePhonyGet,
  podName: 'successful',
};

export const ManyPorts = Template.bind({});
ManyPorts.args = {
  useGet: usePhonyGet,
  podName: 'manyports',
};
