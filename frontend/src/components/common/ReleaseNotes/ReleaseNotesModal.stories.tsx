import ReleaseNotesModal from './ReleaseNotesModal';

export default {
  title: 'common/ReleaseNotes/ReleaseNotesModal',
  component: ReleaseNotesModal,
  argTypes: {},
};

export const Show = {
  args: {
    releaseNotes: '### Hello\n\nworld',
    appVersion: '1.9.9',
  },
};

export const Closed = {
  args: {
    releaseNotes: undefined,
    appVersion: null,
  },
};

export const ShowNoNotes = {
  args: {
    releaseNotes: undefined,
    appVersion: '1.8.8',
  },
};
