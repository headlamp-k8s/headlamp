import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import store from '../../../redux/stores/store';
import { TestContext } from '../../../test';
import { PluginSettingsPure, PluginSettingsPureProps } from './PluginSettings';

export default {
  title: 'Settings/PluginSettings',
  component: PluginSettingsPure,
} as Meta;

const Template: Story<PluginSettingsPureProps> = args => (
  <TestContext store={store}>
    <PluginSettingsPure {...args} />
  </TestContext>
);

/**
 * createDemoData function will create example data objects to act as plugin data.
 * The function will return an array of demo data objects based on the number specified.
 */
function createDemoData(arrSize: number) {
  /** Static list of plugins */
  const pluginArr: any = [];

  for (let i = 0; i < arrSize; i++) {
    const newPlugin = {
      name: `plugin a ${i}`,
      description: `This is a plugin for this project PLUGIN A${i}`,
      homepage: `https://plugin-link-${i}`,
      isEnabled: i % 2 === 0,
    };
    pluginArr.push(newPlugin);
  }
  return pluginArr;
}

/**
 * Creation of data arrays ranging from 0 to 50 to demo state of empty, few, many, and large numbers of data objects.
 * NOTE: The numbers used are up to the users preference.
 */
const demoFew = createDemoData(5);
const demoFewSaveEnable = createDemoData(5);
const demoMany = createDemoData(15);
const demoMore = createDemoData(50);
const demoEmpty = createDemoData(0);

/** NOTE: Use console inspect to track console log messages. */
export const FewItems = Template.bind({});
FewItems.args = {
  plugins: demoFew,
  onSave: plugins => {
    console.log('demo few', plugins);
  },
};

/** NOTE: The save button will load by default on plugin page regardless of data */
export const DefaultSaveEnable = Template.bind({});
DefaultSaveEnable.args = {
  plugins: demoFewSaveEnable,
  onSave: plugins => {
    console.log('demo few', plugins);
  },
  saveAlwaysEnable: true,
};

export const ManyItems = Template.bind({});
ManyItems.args = {
  plugins: demoMany,
  onSave: plugins => {
    console.log('demo many', plugins);
  },
};

export const MoreItems = Template.bind({});
MoreItems.args = {
  plugins: demoMore,
  onSave: plugins => {
    console.log('demo more', plugins);
  },
};

export const Empty = Template.bind({});
Empty.args = {
  plugins: demoEmpty,
};
