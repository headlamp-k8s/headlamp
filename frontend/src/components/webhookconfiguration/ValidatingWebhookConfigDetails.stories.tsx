import { Meta, Story } from '@storybook/react/types-6-0';
import VWC, {
  KubeValidatingWebhookConfiguration,
} from '../../lib/k8s/validatingWebhookConfiguration';
import { TestContext } from '../../test';
import { createVWC } from './storyHelper';
import ValidatingWebhookConfigDetails from './ValidatingWebhookConfigDetails';

const usePhonyGet: KubeValidatingWebhookConfiguration['useGet'] = (withService: boolean) => {
  return [new VWC(createVWC(withService)), null, () => {}, () => {}] as any;
};

export default {
  title: 'WebhookConfiguration/ValidatingWebhookConfig/Details',
  component: ValidatingWebhookConfigDetails,
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

  VWC.useGet = () => usePhonyGet(withService);

  return (
    <TestContext>
      <ValidatingWebhookConfigDetails />;
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
