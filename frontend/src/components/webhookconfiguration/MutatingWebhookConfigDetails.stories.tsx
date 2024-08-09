import { Meta, Story } from '@storybook/react';
import { useMockQuery } from '../../helpers/testHelpers';
import MWC from '../../lib/k8s/mutatingWebhookConfiguration';
import { TestContext } from '../../test';
import MutatingWebhookConfigDetails from './MutatingWebhookConfigDetails';
import { createMWC } from './storyHelper';

const usePhonyQuery = (withService: boolean) => {
  return useMockQuery.data(new MWC(createMWC(withService)));
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

  MWC.useQuery = usePhonyQuery(withService);

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
