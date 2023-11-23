import Container from '@mui/material/Container';
import { Meta, Story } from '@storybook/react/types-6-0';
import Event from '../../lib/k8s/event';
import { TestContext } from '../../test';
import Overview from './Overview';

Event.useList = () => {
  const objList = [
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
  ].map((data: any) => new Event(data));
  return [objList, null, () => {}, () => {}] as any;
};

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

const Template: Story = () => {
  return (
    <Container maxWidth="xl">
      <Overview />
    </Container>
  );
};

export const Events = Template.bind({});
