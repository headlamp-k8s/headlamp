import { Meta, StoryFn } from '@storybook/react';
import PersistentVolume, { KubePersistentVolume } from '../../lib/k8s/persistentVolume';
import { TestContext } from '../../test';
import Details from './ClaimDetails';
import { BASE_PV } from './storyHelper';

export default {
  title: 'PersistentVolume/DetailsView',
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
  json?: KubePersistentVolume;
}

const Template: StoryFn = (args: MockerStory) => {
  const { json } = args;
  if (!!json) {
    PersistentVolume.useGet = () => [new PersistentVolume(json), null, () => {}, () => {}] as any;
  }
  return <Details />;
};

export const Base = Template.bind({});
Base.args = {
  json: BASE_PV,
};
