import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import ErrorBoundary, { ErrorBoundaryProps } from './ErrorBoundary';

function BrokenComponent() {
  throw 'Error overlay only shown in dev mode. Close to see ErrorBoundary.';
  return null;
}

const storyData = {
  title: 'common/ErrorBoundary',
  component: ErrorBoundary,
  argTypes: {},
} as Meta;
export default storyData;

const Template: Story<ErrorBoundaryProps> = args => (
  <ErrorBoundary {...args}>
    <i>This is not failing.</i>
  </ErrorBoundary>
);
export const NoProblem = Template.bind({});
NoProblem.args = {};

const BrokenTemplate: Story<ErrorBoundaryProps> = args => (
  <ErrorBoundary {...args}>
    <BrokenComponent />
  </ErrorBoundary>
);
export const BrokenNoFallback = BrokenTemplate.bind({});
BrokenNoFallback.args = {};

const BrokenFallbackTemplate: Story<ErrorBoundaryProps> = args => (
  <ErrorBoundary {...args}>
    <BrokenComponent />
  </ErrorBoundary>
);
export const BrokenFallback = BrokenFallbackTemplate.bind({});
BrokenFallback.args = {
  fallback: ({ error }: { error: Error }) => {
    return <div>This is a fallback. Error msg: "{error}"</div>;
  },
};

export const BrokenFallbackElement = BrokenFallbackTemplate.bind({});
BrokenFallback.args = {
  fallback: <p>A simple element</p>,
};
