import UpdatePopup from './UpdatePopup';

export default {
  title: 'common/ReleaseNotes/UpdatePopup',
  component: UpdatePopup,
  argTypes: {},
};

export const Show = {
  args: {
    releaseDownloadURL: 'https://example.com',
  },
};

export const Closed = {
  args: {
    releaseDownloadURL: 'https://example.com',
  },
};
