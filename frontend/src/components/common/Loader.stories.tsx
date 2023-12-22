import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import Loader, { LoaderProps } from './Loader';

export default {
  title: 'Loader',
  component: Loader,
} as Meta;

const Template: StoryFn<LoaderProps> = args => <Loader {...args} />;

export const WithContainer = Template.bind({});
WithContainer.args = {
  title: 'Loading with a container',
};

export const WithoutContainer = Template.bind({});
WithoutContainer.args = {
  noContainer: true,
  title: 'Loading without a container',
};
