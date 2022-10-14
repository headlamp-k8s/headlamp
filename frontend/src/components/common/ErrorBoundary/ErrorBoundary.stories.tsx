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
const NoProblem = Template.bind({});
NoProblem.args = {};

// Do not run these under test, because they emit lots of console.error logs.
// It's still useful to run them in the storybook, to see and test them manually.
type StoryOrNull = Story<ErrorBoundaryProps> | (() => void);
let BrokenNoFallback: StoryOrNull = () => 'disabled under test to avoid console spam';
let BrokenFallback: StoryOrNull = () => 'disabled under test to avoid console spam';
let BrokenFallbackElement: StoryOrNull = () => 'disabled under test to avoid console spam';

if (process.env.UNDER_TEST !== 'true') {
  // These are only seen in the storybook, not under test.
  const BrokenTemplate: Story<ErrorBoundaryProps> = args => (
    <ErrorBoundary {...args}>
      <BrokenComponent />
    </ErrorBoundary>
  );
  BrokenNoFallback = BrokenTemplate.bind({});
  BrokenNoFallback.args = {};

  const BrokenFallbackTemplate: Story<ErrorBoundaryProps> = args => (
    <ErrorBoundary {...args}>
      <BrokenComponent />
    </ErrorBoundary>
  );
  BrokenFallback = BrokenFallbackTemplate.bind({});
  BrokenFallback.args = {
    fallback: ({ error }: { error: Error }) => {
      return <div>This is a fallback. Error msg: "{error}"</div>;
    },
  };

  BrokenFallbackElement = BrokenFallbackTemplate.bind({});
  BrokenFallback.args = {
    fallback: <p>A simple element</p>,
  };
}

export { NoProblem, BrokenNoFallback, BrokenFallback, BrokenFallbackElement };
