import { Icon } from '@iconify/react';
import IconButton from '@material-ui/core/IconButton';
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
