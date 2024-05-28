import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import { Meta, StoryFn } from '@storybook/react';
import { Provider } from 'react-redux';
import store from '../../../redux/stores/store';
import { EditorDialog, EditorDialogProps } from '..';

export default {
  title: 'Resource/EditorDialog',
  component: EditorDialog,
  argTypes: {},
  decorators: [
    Story => {
      return (
        <Provider store={store}>
          <Story />
        </Provider>
      );
    },
  ],
} as Meta;

const Template: StoryFn<EditorDialogProps> = args => {
  return (
    <EditorDialog
      {...args}
      item={{
        metadata: {
          name: 'Dummy_Name',
          uid: 'UNIQUE_ID',
          resourceVersion: '0.0.0',
          selfLink: 'https://',
          creationTimestamp: '10/12/2021',
        },
        kind: 'DUMMY_KUBE_KIND',
      }}
    />
  );
};

export const EditorDialogWithResource = Template.bind({});
EditorDialogWithResource.args = {
  open: true,
};

export const EditorDialogWithResourceClosed = Template.bind({});
EditorDialogWithResourceClosed.args = {
  open: false,
};

export const ExtraActions = Template.bind({});
ExtraActions.args = {
  open: true,
  actions: [
    <FormGroup row>
      <FormControlLabel
        control={<Switch checked onChange={() => {}} />}
        label="Extra Action Switch"
      />
    </FormGroup>,
  ],
};
