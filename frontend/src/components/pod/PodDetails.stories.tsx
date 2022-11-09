import { Meta, Story } from '@storybook/react/types-6-0';
import { KubeObjectClass } from '../../lib/k8s/cluster';
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
  podName: string;
}

const Template: Story<MockerStory> = args => {
  const { useGet, useList, podName } = args;

  if (!!useGet) {
    Pod.useGet = args.useGet!;
  }
  if (!!useList) {
    Pod.useList = args.useList!;
  }

  return (
    <TestContext routerMap={{ namespace: 'default', name: podName }}>
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
