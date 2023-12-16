import Container from '@mui/material/Container';
import { Meta, Story } from '@storybook/react/types-6-0';
import ValidatingWebhookConfiguration from '../../lib/k8s/validatingWebhookConfiguration';
import { TestContext } from '../../test';
import { generateK8sResourceList } from '../../test/mocker';
import { createVWC } from './storyHelper';
import List from './ValidatingWebhookConfigList';

const VWCTemplate = createVWC(false);
VWCTemplate.metadata.name = 'vwc-test-{{i}}';

const VWCWithServiceTemplate = createVWC(true);
VWCWithServiceTemplate.metadata.name = 'vwc-test-with-service-{{i}}';

ValidatingWebhookConfiguration.useList = () => {
  const objList = generateK8sResourceList(VWCTemplate, {
    numResults: 3,
    instantiateAs: ValidatingWebhookConfiguration,
  }).concat(
    generateK8sResourceList(VWCWithServiceTemplate, {
      numResults: 3,
      instantiateAs: ValidatingWebhookConfiguration,
    })
  );
  return [objList, null, () => {}, () => {}] as any;
};

export default {
  title: 'WebhookConfiguration/ValidatingWebhookConfig/List',
  component: List,
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
      <List />
    </Container>
  );
};

export const Items = Template.bind({});
