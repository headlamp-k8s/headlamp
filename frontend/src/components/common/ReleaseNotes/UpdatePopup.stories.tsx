import UpdatePopup, { UpdatePopupProps } from './UpdatePopup';

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

export const Fetching = {
  args: {
    releaseDownloadURL: null,
    fetchingRelease: true,
  } as UpdatePopupProps,
};

export const FetchFailed = {
  args: {
    releaseDownloadURL: null,
    fetchingRelease: false,
    releaseFetchFailed: true,
  } as UpdatePopupProps,
};
