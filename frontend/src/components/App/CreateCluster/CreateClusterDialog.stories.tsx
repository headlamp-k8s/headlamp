import CreateClusterDialog, { CreateClusterDialogProps } from './CreateClusterDialog';

export default {
  component: CreateClusterDialog,
  argTypes: {
    onClose: { action: 'closed' },
    onSave: { action: 'saved' },
    onEditorChanged: { action: 'editor changed' },
  },
};

export const OpenDialog = {
  render: () => <CreateClusterDialog {...OpenDialog.args} />,
  args: {
    open: true,
    onClose: () => {},
    onSave: data => {
      console.log(`Cluster created: ${data.clusterName}, Type: ${data.clusterType}`);
    },
    saveLabel: 'Create Cluster',
    errorMessage: '',
    onEditorChanged: () => {},
    title: 'Create Cluster',
    saving: false,
    savingLines: [],
    creatingDone: false,
  } as CreateClusterDialogProps,
};

export const Creating = {
  render: () => <CreateClusterDialog {...Creating.args} />,
  args: {
    open: true,
    onClose: () => {},
    onSave: data => {
      console.log(`Cluster created: ${data.clusterName}, Type: ${data.clusterType}`);
    },
    saveLabel: 'Create Cluster',
    errorMessage: '',
    onEditorChanged: () => {},
    title: 'Create Cluster',
    saving: true,
    savingLines: [
      'Creating cluster…',
      'Setting up networking and some other stuff really long line…',
      'Starting cluster…',
      'Cluster started.',
    ],
    creatingDone: false,
  } as CreateClusterDialogProps,
};

export const Done = {
  render: () => <CreateClusterDialog {...Done.args} />,
  args: {
    open: true,
    onClose: () => {},
    onSave: data => {
      console.log(`Cluster created: ${data.clusterName}, Type: ${data.clusterType}`);
    },
    saveLabel: 'Create Cluster',
    errorMessage: '',
    onEditorChanged: () => {},
    title: 'Create Cluster',
    saving: true,
    savingLines: [
      'Creating cluster…',
      'Setting up networking and some other stuff really long line…',
      'Starting cluster…',
      'Cluster started.',
    ],
    creatingDone: true,
  } as CreateClusterDialogProps,
};
