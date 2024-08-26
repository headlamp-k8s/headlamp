import { Meta, StoryFn } from '@storybook/react';
import { StreamResultsCb } from '../../lib/k8s/apiProxy';
import { LogOptions } from '../../lib/k8s/pod';
import { TestContext } from '../../test';
import { PodLogViewer } from './Details';

export default {
  title: 'Pod/PodLogViewer',
  component: PodLogViewer,
  argTypes: {},
} as Meta;

const Template: StoryFn = () => {
  return (
    <TestContext routerMap={{ namespace: 'default', name: 'pod-name' }}>
      <PodLogViewer
        open
        onClose={() => {}}
        item={
          {
            spec: {
              containers: [{ name: 'container-name' } as any],
            },
            getName() {
              return 'pod-name';
            },
            getLogs,
          } as any
        }
      />
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

  onLogs(generateLogs());
}

export const Logs = Template.bind({});
