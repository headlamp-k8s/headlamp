import { AppLogoProps } from '@kinvolk/headlamp-plugin/lib';
import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ReactiveLogo } from './index';

export default {
  title: 'ReactiveLogo',
  component: ReactiveLogo,
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as Meta;

const Template: Story<AppLogoProps> = args => <ReactiveLogo {...args} />;

export const SmallDark = Template.bind({});
SmallDark.args = {
  logoType: 'small',
  themeName: 'dark',
};

export const SmallLight = Template.bind({});
SmallLight.args = {
  logoType: 'small',
  themeName: 'light',
};

export const LargeDark = Template.bind({});
LargeDark.args = {
  logoType: 'large',
  themeName: 'dark',
};

export const LargeLight = Template.bind({});
LargeLight.args = {
  logoType: 'large',
  themeName: 'light',
};
