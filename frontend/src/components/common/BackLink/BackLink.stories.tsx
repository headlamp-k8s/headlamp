import { Meta, StoryFn } from '@storybook/react';
import BackLink, { BackLinkProps } from './BackLink';

export default {
  title: 'common/BackLink',
  component: BackLink,
  argTypes: {},
} as Meta;

const Template: StoryFn<BackLinkProps> = args => <BackLink {...args} />;

export const Default = Template.bind({});
Default.args = {
  to: '/home',
};

export const CustomLink = Template.bind({});
CustomLink.args = {
  to: '/custom-page',
};
