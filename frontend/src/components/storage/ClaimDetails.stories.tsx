import { Meta, Story } from '@storybook/react';
import { useMockQuery } from '../../helpers/testHelpers';
import PersistentVolumeClaim, {
  KubePersistentVolumeClaim,
} from '../../lib/k8s/persistentVolumeClaim';
import { TestContext } from '../../test';
import Details from './ClaimDetails';
import { BASE_PVC } from './storyHelper';

export default {
  title: 'PersistentVolumeClaim/DetailsView',
  component: Details,
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

interface MockerStory {
  json?: KubePersistentVolumeClaim;
}

const Template: Story = (args: MockerStory) => {
  const { json } = args;
  if (!!json) {
    PersistentVolumeClaim.useQuery = useMockQuery.data(new PersistentVolumeClaim(json));
  }
  return <Details />;
};

export const Base = Template.bind({});
Base.args = {
  json: BASE_PVC,
};
