import { Meta, StoryFn } from '@storybook/react';
import { TestContext } from '../../../test';
import { MatchExpressions, type MatchExpressionsProps } from './MatchExpressions';

const exampleMatchLabels = {
  env: 'production',
  tier: 'frontend',
};

const exampleMatchExpressions = [
  { key: 'version', operator: 'Equals', values: ['1.0'] },
  { key: 'zone', operator: 'In', values: ['us-east-1', 'us-west-2'] },
  { key: 'beta', operator: 'DoesNotExist', values: [] },
];

export default {
  title: 'Resource/MatchExpressions',
  component: MatchExpressions,
  decorators: [
    Story => (
      <TestContext>
        <Story />
      </TestContext>
    ),
  ],
} as Meta;

const Template: StoryFn<MatchExpressionsProps> = args => <MatchExpressions {...args} />;

export const Default = Template.bind({});
Default.args = {
  matchLabels: exampleMatchLabels,
};

export const WithExpressions = Template.bind({});
WithExpressions.args = {
  matchLabels: exampleMatchLabels,
  matchExpressions: exampleMatchExpressions,
};
