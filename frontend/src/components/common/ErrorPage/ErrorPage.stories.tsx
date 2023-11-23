import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import NotFoundImage from '../../../assets/headlamp-404.svg';
import ErrorComponent, { ErrorComponentProps } from '.';

export default {
  title: 'common/GenericError',
  component: ErrorComponent,
} as Meta;
const Template: Story<ErrorComponentProps> = args => <ErrorComponent {...args} />;

export const Default = Template.bind({});

export const DifferentImage = Template.bind({});
DifferentImage.args = {
  graphic: NotFoundImage,
};

export const NumberGraphic = Template.bind({});
NumberGraphic.args = {
  graphic: 404,
};

export const StringGraphic = Template.bind({});
StringGraphic.args = {
  graphic: 'Oh no!',
};

export const ComponentTitle = Template.bind({});
ComponentTitle.args = {
  title: <Button onClick={() => alert("It's dead!")}>Oh no!</Button>,
};

export const StringMessage = Template.bind({});
StringMessage.args = {
  message: 'Not sure what to do!',
};

export const ComponentMessage = Template.bind({});
ComponentMessage.args = {
  message: <Typography variant="h3">Not sure what to do!</Typography>,
};
