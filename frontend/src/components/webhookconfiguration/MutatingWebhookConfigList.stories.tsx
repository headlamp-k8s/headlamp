import Container from '@mui/material/Container';
import { Meta, Story } from '@storybook/react/types-6-0';
import MutatingWebhookConfiguration from '../../lib/k8s/mutatingWebhookConfiguration';
import { TestContext } from '../../test';
import { generateK8sResourceList } from '../../test/mocker';
import List from './MutatingWebhookConfigList';
import { createMWC } from './storyHelper';

const MWCTemplate = createMWC(false);
MWCTemplate.metadata.name = 'mwc-test-{{i}}';

const MWCWithServiceTemplate = createMWC(true);
MWCWithServiceTemplate.metadata.name = 'mwc-test-with-service-{{i}}';

MutatingWebhookConfiguration.useList = () => {
  const objList = generateK8sResourceList(MWCTemplate, {
    numResults: 3,
    instantiateAs: MutatingWebhookConfiguration,
  }).concat(
    generateK8sResourceList(MWCWithServiceTemplate, {
      numResults: 3,
      instantiateAs: MutatingWebhookConfiguration,
    })
  );
  return [objList, null, () => {}, () => {}] as any;
};

export default {
  title: 'WebhookConfiguration/MutatingWebhookConfig/List',
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
