import { Meta, Story } from '@storybook/react';
import { useMockQuery } from '../../helpers/testHelpers';
import StorageClass, { KubeStorageClass } from '../../lib/k8s/storageClass';
import { TestContext } from '../../test';
import Details from './ClaimDetails';
import { BASE_SC } from './storyHelper';

export default {
  title: 'StorageClass/DetailsView',
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
  json?: KubeStorageClass;
}

const Template: Story = (args: MockerStory) => {
  const { json } = args;
  if (!!json) {
    StorageClass.useQuery = useMockQuery.data(new StorageClass(json));
  }
  return <Details />;
};

export const Base = Template.bind({});
Base.args = {
  json: BASE_SC,
};
