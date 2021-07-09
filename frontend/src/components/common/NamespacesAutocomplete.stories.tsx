import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import {
  PureNamespacesAutocomplete,
  PureNamespacesAutocompleteProps,
} from './NamespacesAutocomplete';

export default {
  title: 'NamespacesAutocomplete',
  component: PureNamespacesAutocomplete,
  decorators: [Story => <Story />],
} as Meta;

const Template: Story<PureNamespacesAutocompleteProps> = args => {
  const [filter, setFilter] = React.useState<{ namespaces: Set<string>; search: string }>({
    namespaces: new Set([]),
    search: '',
  });
  const namespaceNames = React.useState<string[]>(['default', 'kube-system', 'kube-public'])[0];

  const onChange = (event: React.ChangeEvent<{}>, newValue: string[]) => {
    setFilter({
      namespaces: new Set(newValue),
      search: '',
    });
  };

  return (
    <PureNamespacesAutocomplete
      {...args}
      namespaceNames={namespaceNames}
      onChange={onChange}
      filter={filter}
    />
  );
};

export const Some = Template.bind({});
Some.args = {};
