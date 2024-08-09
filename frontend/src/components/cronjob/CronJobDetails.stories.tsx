import { Meta, Story } from '@storybook/react';
import { KubeObjectClass } from '../../lib/k8s/cluster';
import CronJob from '../../lib/k8s/cronJob';
import Job from '../../lib/k8s/job';
import { TestContext } from '../../test';
import CronJobDetails from './Details';
import { cronJobList } from './storyHelper';

CronJob.getAuthorization = (): Promise<{ status: any }> => {
  return new Promise(resolve => {
    resolve({ status: { allowed: true, reason: '', code: 200 } });
  });
};

Job.getAuthorization = CronJob.getAuthorization;

const usePhonyQuery: KubeObjectClass['useQuery'] = ({ name, namespace }: any) => {
  const cronJobJson = cronJobList.find(
    cronJob => cronJob.metadata.name === name && cronJob.metadata.namespace === namespace
  );
  return { data: new CronJob(cronJobJson!), error: null } as any;
};

export default {
  title: 'CronJob/CronJobDetailsView',
  component: CronJobDetails,
  argTypes: {},
} as Meta;

interface MockerStory {
  useQuery?: KubeObjectClass['useQuery'];
  cronJobName: string;
}

const Template: Story<MockerStory> = args => {
  const { useQuery, cronJobName } = args;

  if (!!useQuery) {
    CronJob.useQuery = args.useQuery!;
  }

  return (
    <TestContext routerMap={{ namespace: 'default', name: cronJobName }}>
      <CronJobDetails />
    </TestContext>
  );
};

export const EveryMinute = Template.bind({});
EveryMinute.args = {
  useQuery: usePhonyQuery,
  cronJobName: 'every-minute',
};

export const EveryAst = Template.bind({});
EveryAst.args = {
  useQuery: usePhonyQuery,
  cronJobName: 'every-minute-one-char',
};
