import { Meta, Story } from '@storybook/react/types-6-0';
import { KubeObjectClass } from '../../lib/k8s/cluster';
import CronJob from '../../lib/k8s/cronJob';
import { TestContext } from '../../test';
import CronJobDetails from './Details';
import { cronJobList } from './storyHelper';

// eslint-disable-next-line
const usePhonyGet: KubeObjectClass['useGet'] = (name, namespace) => {
  const cronJobJson = cronJobList.find(
    cronJob => cronJob.metadata.name === name && cronJob.metadata.namespace === namespace
  );
  return [new CronJob(cronJobJson!), null, () => {}, () => {}] as any;
};

export default {
  title: 'CronJob/CronJobDetailsView',
  component: CronJobDetails,
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
  cronJobName: string;
}

// eslint-disable-next-line
const Template: Story<MockerStory> = args => {
  const { useGet, useList, cronJobName } = args;

  if (!!useGet) {
    CronJob.useGet = args.useGet!;
  }
  if (!!useList) {
    CronJob.useList = args.useList!;
  }

  return (
    <TestContext routerMap={{ namespace: 'default', name: cronJobName }}>
      <CronJobDetails />
    </TestContext>
  );
};

// export const EveryMinute = Template.bind({});
// EveryMinute.args = {
//   useGet: usePhonyGet,
//   cronJobName: 'every-minute',
// };

// export const EveryAst = Template.bind({});
// EveryAst.args = {
//   useGet: usePhonyGet,
//   cronJobName: 'every-minute-one-char',
// };
