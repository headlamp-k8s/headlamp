import { Icon } from '@iconify/react';
import IconButton from '@mui/material/IconButton';
import { Meta, Story } from '@storybook/react/types-6-0';
import i18next from 'i18next';
import TooltipLight, { TooltipLightProps } from './TooltipLight';

export default {
  title: 'Tooltip/TooltipLight',
  component: TooltipLight,
} as Meta;

const Template: Story<TooltipLightProps> = args => <TooltipLight {...args} />;

export const Add = Template.bind({});
Add.args = {
  title: 'Add',
  children: (
    <IconButton aria-label={i18next.t('translation|Add')}>
      <Icon color="#adadad" icon="mdi:plus-circle" width="48" />
    </IconButton>
  ),
};

export const Interactive = Template.bind({});
Interactive.args = {
  title: 'Add',
  interactive: true,
  children: (
    <IconButton aria-label={i18next.t('translation|Add')}>
      <Icon color="#adadad" icon="mdi:plus-circle" width="48" />
    </IconButton>
  ),
};

export const NotInteractive = Template.bind({});
NotInteractive.args = {
  title: 'Add',
  interactive: false,
  children: (
    <IconButton aria-label={i18next.t('translation|Add')}>
      <Icon color="#adadad" icon="mdi:plus-circle" width="48" />
    </IconButton>
  ),
};
