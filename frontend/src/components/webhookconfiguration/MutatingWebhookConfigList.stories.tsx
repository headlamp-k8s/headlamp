import Container from '@mui/material/Container';
import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import MutatingWebhookConfiguration from '../../lib/k8s/mutatingWebhookConfiguration';
import { TestContext } from '../../test';
import { generateK8sResourceList } from '../../test/mocker';
import List from './MutatingWebhookConfigList';
import { createMWC } from './storyHelper';

const MWCTemplate = createMWC(false);
MWCTemplate.metadata.name = 'mwc-test-{{i}}';

const MWCWithServiceTemplate = createMWC(true);
MWCWithServiceTemplate.metadata.name = 'mwc-test-with-service-{{i}}';

const objList = generateK8sResourceList(MWCTemplate, {
  numResults: 3,
  instantiateAs: MutatingWebhookConfiguration,
})
  .concat(
    generateK8sResourceList(MWCWithServiceTemplate, {
      numResults: 3,
      instantiateAs: MutatingWebhookConfiguration,
      uidPrefix: 'with-service-',
    })
  )
  .map(it => it.jsonData);

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

const Template: StoryFn = () => {
  return (
    <Container maxWidth="xl">
      <List />
    </Container>
  );
};

export const Items = Template.bind({});
Items.parameters = {
  msw: {
    handlers: {
      story: [
        http.get(
          'http://localhost:4466/apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations',
          () =>
            HttpResponse.json({
              kind: 'WebhookConfigurationList',
              items: objList,
              metadata: {},
            })
        ),
      ],
    },
  },
};
