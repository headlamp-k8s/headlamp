import { Meta, Story } from '@storybook/react/types-6-0';
import { MemoryRouter } from 'react-router-dom';
import Link, { LinkProps } from './Link';

export default {
  title: 'Link',
  component: Link,
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} as Meta;

const Template: Story<LinkProps> = args => <Link {...args}>a link</Link>;

// @todo: the Link depends on some router.tsx global functions
//        that would require mocking at the webpack layer.

export const Basic = Template.bind({});
Basic.args = {
  routeName: 'namespaces',
  params: {},
  search: '',
  state: {},
};

export const Params = Template.bind({});
Params.args = {
  routeName: 'node',
  params: { name: 'anode' },
};

export const AutoTooltip = Template.bind({});
AutoTooltip.args = {
  routeName: 'node',
  params: { name: 'anode' },
  tooltip: true,
};

export const ExplicitTooltip = Template.bind({});
ExplicitTooltip.args = {
  routeName: 'node',
  params: { name: 'anode' },
  tooltip: 'A tooltip',
};
