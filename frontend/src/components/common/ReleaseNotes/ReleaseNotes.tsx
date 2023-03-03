import { Octokit } from '@octokit/core';
import React from 'react';
import semver from 'semver';
import helpers from '../../../helpers';
import ReleaseNotesModal from './ReleaseNotesModal';
import UpdatePopup from './UpdatePopup';

export default function ReleaseNotes() {
  const { desktopApi } = window;
  const [releaseNotes, setReleaseNotes] = React.useState<string>('');
  const [releaseDownloadURL, setReleaseDownloadURL] = React.useState<string | null>(null);
  const [fetchingRelease, setFetchingRelease] = React.useState<boolean>(false);
  const [releaseFetchFailed, setReleaseFetchFailed] = React.useState<boolean>(false);
  const [skipFetch, setSkipFetch] = React.useState(false);

  // network controller this makes sure if the octockit request is still lying around we
  // abort it on fetch release skip press button click
  const controller = new AbortController();
  const signal = controller.signal;

  React.useEffect(() => {
    if (desktopApi) {
      desktopApi.receive(
        'appConfig',
        (config: { appVersion: string; checkForUpdates: boolean }) => {
          const { appVersion: currentBuildAppVersion, checkForUpdates = true } = config;
          if (!checkForUpdates) {
            console.debug("Skipping update check because config's checkForUpdates is false");
            return;
          }

          const octokit = new Octokit({
            timeout: 10000,
            signal,
          });

          async function fetchRelease() {
            // attach a timeout which checks after 5 second of fetching release
            // if the release request was not successful
            const timeoutID = setTimeout(() => {
              setFetchingRelease(true);
            }, 5000);

            const githubReleaseURL = `GET /repos/{owner}/{repo}/releases`;
            // get me all the releases -> default decreasing order of releases
            const response = await octokit.request(githubReleaseURL, {
              owner: 'kinvolk',
              repo: 'headlamp',
            });

            // Get the latest release that is not headlamp-plugin or headlamp-helm.
            const latestRelease = response.data.find(
              release => !release.name?.startsWith('headlamp-')
            );
            if (
              latestRelease &&
              semver.gt(latestRelease.name as string, currentBuildAppVersion) &&
              !process.env.FLATPAK_ID
            ) {
              setReleaseDownloadURL(latestRelease.html_url);
            }

            // check if there is already a version in store if it exists don't store the current version
            // this check will help us later in determining whether we are on the latest release or not.
            const storedAppVersion = helpers.getAppVersion();
            let releaseNotes = '';
            if (storedAppVersion && semver.lt(storedAppVersion as string, currentBuildAppVersion)) {
              // get the release notes for the version with which the app was built with
              const githubReleaseURL = `GET /repos/{owner}/{repo}/releases/tags/v${currentBuildAppVersion}`;
              try {
                const response = await octokit.request(githubReleaseURL, {
                  owner: 'kinvolk',
                  repo: 'headlamp',
                });
                const [notes] = response.data.body.split('<!-- end-release-notes -->');
                if (!!notes) {
                  releaseNotes = notes;
                }
              } catch (err) {
                setReleaseFetchFailed(true);
                console.error(
                  `Error getting release notes for version ${currentBuildAppVersion}:`,
                  err
                );
              }
            }

            // If all of the above was done before we need to warn the user, we don't need to warn them.
            clearTimeout(timeoutID);
            setFetchingRelease(false);

            // set the store version to the current so that we don't show release notes on
            // every start of app
            helpers.setAppVersion(currentBuildAppVersion);

            // Calling this after setting the version above, so the release notes have the right version
            // set when they show it.
            if (!!releaseNotes) {
              setReleaseNotes(releaseNotes);
            }
          }

          const isUpdateCheckingDisabled = JSON.parse(
            localStorage.getItem('disable_update_check') || 'false'
          );
          if (!isUpdateCheckingDisabled && !fetchingRelease && !skipFetch) {
            fetchRelease();
          }
        }
      );
    }
  }, [fetchingRelease, skipFetch]);

  React.useEffect(() => {
    desktopApi?.send('appConfig');
  }, []);

  return (
    <>
      {
        <UpdatePopup
          releaseDownloadURL={releaseDownloadURL || ''}
          fetchingRelease={fetchingRelease}
          releaseFetchFailed={releaseFetchFailed}
          skipUpdateHandler={() => {
            // abort the octockit request to fetch github release
            controller.abort();
            setSkipFetch(false);
            setFetchingRelease(false);
          }}
        />
      }
      {releaseNotes && (
        <ReleaseNotesModal releaseNotes={releaseNotes} appVersion={helpers.getAppVersion()} />
      )}
    </>
  );
}
