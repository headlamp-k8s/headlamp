import { Meta, Story } from '@storybook/react/types-6-0';
import { EditorDialog, EditorDialogProps } from '..';

export default {
  title: 'Resource/EditorDialog',
  component: EditorDialog,
  argTypes: {},
} as Meta;

const Template: Story<EditorDialogProps> = args => {
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
