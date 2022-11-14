import { Meta, Story } from '@storybook/react/types-6-0';
import { StreamResultsCb } from '../../lib/k8s/apiProxy';
import { AuthRequestResourceAttrs, KubeObjectClass } from '../../lib/k8s/cluster';
import Pod, { KubePod, LogOptions } from '../../lib/k8s/pod';
import { TestContext } from '../../test';
import PodDetails, { PodDetailsProps } from './Details';
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

const phonyGetAuthorization: KubeObjectClass['getAuthorization'] = async (
  verb: string,
  resourceAttrs?: AuthRequestResourceAttrs
) => {
  return new Promise(exec => {
    exec({
      status: {
        allowed: resourceAttrs?.subresource === 'log',
      },
    });
  });
};

// @todo: There is no "PodLogs" component. Stories should be named after the component.

export default {
  title: 'Pod/PodLogs',
  component: PodDetails,
  argTypes: {},
  decorators: [
    Story => {
      return <Story />;
    },
  ],
} as Meta;

interface MockerStory {
  podName: string;
  detailsProps: PodDetailsProps;
  [key: string]: Pod[keyof typeof Pod | keyof typeof Pod.prototype];
}

const Template: Story<MockerStory> = args => {
  const { podName, detailsProps, ...podProps } = args;

  for (const key in podProps) {
    const [prefix, method] = key.split('.');
    if (prefix === 'prototype') {
      Pod.prototype[method as keyof typeof Pod.prototype] = podProps[key];
      continue;
    }

    Pod[key as keyof typeof Pod] = podProps[key];
  }

  return (
    <TestContext routerMap={{ namespace: 'default', name: podName }}>
      <PodDetails {...detailsProps} />;
    </TestContext>
  );
};

function getLogs(container: string, onLogs: StreamResultsCb, logsOptions: LogOptions) {
  const { tailLines, showTimestamps } = logsOptions;

  function generateLogs() {
    const linesToShow = tailLines || 100;
    const logs: string[] = [];

    for (let i = 0; i < linesToShow; i++) {
      logs.push(
        `${
          showTimestamps ? new Date().toISOString() + ' ' : ''
        }(log #${i}): from container ${container} log line log line log line log line log line log line log line log line log line\n`
      );
    }

    return logs;
  }

  // Simulate a stream by continuously generating new logs (only if not under unattended testing).
  // It's purposedly triggering at a fast pace so we see if the UI can handle it.
  const logsHandle = setInterval(() => {
    onLogs(generateLogs());
  }, 100); // ms

  return () => {
    clearInterval(logsHandle as NodeJS.Timeout);
  };
}

export const Logs = Template.bind({});
Logs.args = {
  useGet: usePhonyGet,
  'prototype.getAuthorization': phonyGetAuthorization,
  'prototype.getLogs': getLogs,
  podName: 'running',
  detailsProps: {
    showLogsDefault: true,
  },
};
