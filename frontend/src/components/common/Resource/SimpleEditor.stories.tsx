import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import SimpleEditor from './SimpleEditor';
import { SimpleEditorProps } from './SimpleEditor';

export default {
  title: 'Resource/SimpleEditor',
  component: SimpleEditor,
  argTypes: {},
} as Meta;

const Template: Story<SimpleEditorProps> = args => {
  const [value, setValue] = React.useState<string | undefined>('');
  return (
    <SimpleEditor {...args} value={value} onChange={value => setValue(value)} language="yaml" />
  );
};

export const Simple = Template.bind({});
Simple.args = {};
