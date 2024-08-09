import Container from '@mui/material/Container';
import { Meta, StoryFn } from '@storybook/react';
import { useMockListQuery } from '../../helpers/testHelpers';
import Event from '../../lib/k8s/event';
import { TestContext } from '../../test';
import Overview from './Overview';

Event.useListQuery = useMockListQuery.data(
  [
    {
      apiVersion: 'v1',
      count: 1,
      eventTime: null,
      firstTimestamp: '2023-07-13T13:42:00Z',
      involvedObject: {
        apiVersion: 'v1',
        fieldPath: 'spec.containers{hello}',
        kind: 'Pod',
        name: 'hello-123-123',
        namespace: 'default',
        resourceVersion: '44429432',
        uid: 'a1234',
      },
      kind: 'Event',
      lastTimestamp: '2023-07-13T13:42:00Z',
      message: 'Started container hello',
      metadata: {
        creationTimestamp: '2023-07-13T13:42:00Z',
        name: 'hello-123-123.321',
        namespace: 'default',
        resourceVersion: '44429443',
        uid: 'a12345',
      },
      reason: 'Started',
      reportingComponent: '',
      reportingInstance: '',
      source: {
        component: 'kubelet',
        host: 'aks-agentpool-30159275-vmss00003g',
      },
      type: 'Normal',
    },
    {
      apiVersion: 'v1',
      count: 4449,
      eventTime: null,
      firstTimestamp: '2023-07-12T20:07:10Z',
      involvedObject: {
        apiVersion: 'autoscaling/v2',
        kind: 'HorizontalPodAutoscaler',
        name: 'nginx-deployment',
        namespace: 'default',
        resourceVersion: '1',
        uid: 'b1234',
      },
      kind: 'Event',
      lastTimestamp: '2023-07-13T14:42:17Z',
      message: 'failed to get cpu utilization: missing request for cpu',
      metadata: {
        creationTimestamp: '2023-07-12T20:07:10Z',
        name: 'nginx-deployment.1234',
        namespace: 'default',
        resourceVersion: '1',
        uid: 'b12345',
      },
      reason: 'FailedGetResourceMetric',
      reportingComponent: '',
      reportingInstance: '',
      source: {
        component: 'horizontal-pod-autoscaler',
      },
      type: 'Warning',
    },
    {
      apiVersion: 'v1',
      kind: 'Event',
      metadata: {
        name: 'nginx-deployment-12345',
        namespace: 'default',
        creationTimestamp: '2024-02-12T20:07:10Z',
        uid: 'b123456',
        resourceVersion: '1',
      },
      involvedObject: {
        kind: 'Pod',
        name: 'nginx-deployment-1234567890-abcde',
        namespace: 'default',
        uid: 'b1234',
      },
      reason: 'FailedGetResourceMetric',
      message: 'failed to get cpu utilization: missing request for cpu',
      source: {
        component: 'horizontal-pod-autoscaler',
      },
      firstTimestamp: '2024-02-13T14:42:17Z',
      lastTimestamp: '2024-02-13T14:42:17Z',
      type: 'Warning',
      series: {
        count: 10,
        lastObservedTime: '2024-02-13T14:42:17Z',
      },
    },
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
  ].map((data: any) => new Event(data))
);

export default {
  title: 'cluster/Overview',
  component: Overview,
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

const Template: StoryFn = () => {
  return (
    <Container maxWidth="xl">
      <Overview />
    </Container>
  );
};

export const Events = Template.bind({});
