import { Meta, Story } from '@storybook/react/types-6-0';
import MWC, { KubeMutatingWebhookConfiguration } from '../../lib/k8s/mutatingWebhookConfiguration';
import { TestContext } from '../../test';
import MutatingWebhookConfigDetails from './MutatingWebhookConfigDetails';
import { createMWC } from './storyHelper';

const usePhonyGet: KubeMutatingWebhookConfiguration['useGet'] = (withService: boolean) => {
  return [new MWC(createMWC(withService)), null, () => {}, () => {}] as any;
};

export default {
  title: 'WebhookConfiguration/MutatingWebhookConfig/Details',
  component: MutatingWebhookConfigDetails,
  argTypes: {},
  decorators: [
    Story => {
      return <Story />;
    },
  ],
} as Meta;

interface MockerStory {
  withService: boolean;
}

const Template: Story<MockerStory> = args => {
  const { withService } = args;

  MWC.useGet = () => usePhonyGet(withService);

  return (
    <TestContext>
      <MutatingWebhookConfigDetails />;
    </TestContext>
  );
};

export const WithService = Template.bind({});
WithService.args = {
  withService: true,
};

export const WithURL = Template.bind({});
WithURL.args = {
  withService: false,
};
