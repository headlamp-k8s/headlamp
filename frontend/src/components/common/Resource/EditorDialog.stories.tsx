import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import { Meta, StoryFn } from '@storybook/react';
import { EditorDialog, EditorDialogProps } from '..';

export default {
  title: 'Resource/EditorDialog',
  component: EditorDialog,
  argTypes: {},
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
      <FormControlLabel control={<Switch checked onChange={() => {}} />} label="Switch" />
    </FormGroup>,
  ],
};
