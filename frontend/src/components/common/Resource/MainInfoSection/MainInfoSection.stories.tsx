import { Meta, StoryFn } from '@storybook/react';
import Pod from '../../../../lib/k8s/pod';
import { TestContext } from '../../../../test';
import { podList } from '../../../pod/storyHelper';
import { MainInfoSection, MainInfoSectionProps } from './MainInfoSection';

const resource = new Pod(podList[0]);

export default {
  title: 'Resource/MainInfoSection',
  component: MainInfoSection,
  argTypes: {},
} as Meta;

const Template: StoryFn<MainInfoSectionProps> = (args: MainInfoSectionProps) => (
  <TestContext>
    <MainInfoSection {...args} />
  </TestContext>
);

export const Normal = Template.bind({});
Normal.args = {
  resource,
  title: 'Simple Resource',
};

export const NullBacklink = Template.bind({});
NullBacklink.args = {
  resource,
  backLink: null,
  title: 'No Back Link Resource',
};
