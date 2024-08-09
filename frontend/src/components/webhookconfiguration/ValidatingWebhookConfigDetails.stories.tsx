import { Meta, Story } from '@storybook/react';
import { useMockQuery } from '../../helpers/testHelpers';
import VWC from '../../lib/k8s/validatingWebhookConfiguration';
import { TestContext } from '../../test';
import { createVWC } from './storyHelper';
import ValidatingWebhookConfigDetails from './ValidatingWebhookConfigDetails';

const usePhonyQuery = (withService: boolean) => {
  return useMockQuery.data(new VWC(createVWC(withService)));
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

  VWC.useQuery = usePhonyQuery(withService);

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
