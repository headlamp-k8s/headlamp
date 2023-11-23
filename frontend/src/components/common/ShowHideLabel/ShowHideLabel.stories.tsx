import { Box } from '@mui/material';
import { Meta, Story } from '@storybook/react/types-6-0';
import ShowHideLabel, { ShowHideLabelProps } from './ShowHideLabel';

export default {
  title: 'common/ShowHideLabel',
  component: ShowHideLabel,
  argTypes: {},
} as Meta;

const Template: Story<ShowHideLabelProps> = args => (
  <Box width={300}>
    <ShowHideLabel {...args} />
  </Box>
);

export const Basic = Template.bind({});
Basic.args = {
  children:
    'This is a placeholder label text that is many characters long. It is meant to be used as a temporary label for a UI element until the actual label is available. The text is long enough to fill up the space allocated for the label and provide a realistic preview of how the label will look in the final UI. You can replace this text with the actual label text once it is available. This will ensure that the UI looks complete and professional even during the development phase. Thank you for using this placeholder text!',
  labelId: 'label-id',
};

export const Expanded = Template.bind({});
Expanded.args = {
  children:
    'This is a placeholder label text that is many characters long. It is meant to be used as a temporary label for a UI element until the actual label is available. The text is long enough to fill up the space allocated for the label and provide a realistic preview of how the label will look in the final UI. You can replace this text with the actual label text once it is available. This will ensure that the UI looks complete and professional even during the development phase. Thank you for using this placeholder text!',
  show: true,
  labelId: 'my-label',
};

export const Empty = Template.bind({});
Empty.args = {
  children: '',
  labelId: 'my-label1',
};

export const ShortText = Template.bind({});
ShortText.args = {
  children: 'Short text',
  labelId: 'my-label2',
};
