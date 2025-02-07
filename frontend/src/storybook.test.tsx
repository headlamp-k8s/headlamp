import 'vitest-canvas-mock';
import { composeStories, type Meta, setProjectAnnotations, type StoryFn } from '@storybook/react';
import { act, render as testingLibraryRender, waitFor } from '@testing-library/react';
import { getWorker } from 'msw-storybook-addon';
import path from 'path';
import * as previewAnnotations from '../.storybook/preview';

const annotations = setProjectAnnotations([previewAnnotations, { testingLibraryRender }]);
beforeAll(annotations.beforeAll!);

type StoryFile = {
  default: Meta;
  [name: string]: StoryFn | Meta;
};

const compose = (entry: StoryFile) => {
  try {
    const stories = composeStories(entry);
    return stories;
  } catch (e) {
    throw new Error(
      `There was an issue composing stories for the module: ${JSON.stringify(entry)}, ${e}`
    );
  }
};

function getAllStoryFiles() {
  // Place the glob you want to match your story files
  const storyFiles = Object.entries(
    import.meta.glob<StoryFile>('./**/*.stories.tsx', {
      eager: true,
    })
  );

  return storyFiles.map(([filePath, storyFile]) => {
    const storyDir = path.dirname(filePath);
    const componentName = path.basename(filePath).replace(/\.(stories|story)\.[^/.]+$/, '');
    return { filePath, storyFile, componentName, storyDir };
  });
}

// Recreate similar options to Storyshots. Place your configuration below
const options = {
  storyKindRegex: /^.*?DontTest$/,
  snapshotsDirName: '__snapshots__',
  snapshotExtension: '.stories.storyshot',
};

vi.mock('@iconify/react', () => ({
  Icon: () => null,
  InlineIcon: () => null,
  addCollection: () => {},
}));

vi.mock('@monaco-editor/react', () => ({
  loader: { config: () => null },
  default: () => <div className="mock-monaco-editor" />,
}));

window.matchMedia = () => ({
  matches: false,
  addListener: () => {},
  removeListener: () => {},
  media: '',
  onchange: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => true,
});
/**
 * Recursively walks the tree and replaces any usage of useId
 */
function replaceUseId(node: any) {
  const attributesToReplace = ['id', 'for', 'aria-described', 'aria-labelledby', 'aria-controls'];
  if (node.nodeType === Node.ELEMENT_NODE) {
    for (const attr of node.attributes) {
      if (attributesToReplace.includes(attr.name) && attr.value.includes(':')) {
        // Update the attribute value here
        node.setAttribute(attr.name, ':mock-test-id:');
      }
    }

    if (node.className && typeof node.className === 'string') {
      // Replace dynamic xterm owner classes with a fixed value
      node.className = node.className.replace(
        /xterm-dom-renderer-owner-\d+/g,
        'xterm-dom-renderer-owner'
      );
    }
  }

  // Recursively update child nodes
  for (const child of node.childNodes) {
    replaceUseId(child);
  }
}

describe('Storybook Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  getAllStoryFiles().forEach(({ storyFile, componentName, storyDir }) => {
    const meta = storyFile.default;
    const title = meta.title || componentName;

    if (options.storyKindRegex.test(title) || meta.parameters?.storyshots?.disable) {
      // Skip component tests if they are disabled
      return;
    }

    describe(title, () => {
      const stories = Object.entries(compose(storyFile)).map(([name, story]) => ({
        name,
        story,
      }));

      if (stories.length <= 0) {
        throw new Error(
          `No stories found for this module: ${title}. Make sure there is at least one valid story for this module, without a disable parameter, or add parameters.storyshots.disable in the default export of this file.`
        );
      }

      stories.forEach(({ name, story }) => {
        test(name, async () => {
          // Keep track of sent requests to wait for the to finish
          let requestsSent = 0;
          let requestsEnded = 0;
          const worker = getWorker();
          function onStart() {
            requestsSent++;
          }
          function onEnd() {
            requestsEnded++;
          }
          worker.events.on('request:start', onStart);
          worker.events.on('request:end', onEnd);

          act(() => {
            previewAnnotations.queryClient.clear();
          });
          await act(async () => {
            await story.run();
          });

          // There are a bunch of waterfall requests in the stories
          // So to make sure all requests are sent we need to skip over some ticks
          const tickSkipCount = 10;
          for (let i = 0; i < tickSkipCount; i++) {
            // Advance timers enough for stuff to appear
            // but not too much that things like notifications/toasts are hidden
            act(() => vi.advanceTimersByTime(100));
            await act(() => new Promise(res => process.nextTick(res)));
          }

          // And now we make sure all the requests that have been sent have ended
          await waitFor(() => {
            if (requestsSent !== requestsEnded) {
              throw new Error('waiting');
            }
          });

          await waitFor(() => {
            if (previewAnnotations.queryClient.isFetching()) {
              throw new Error('The react-query is still fetching');
            }
          });

          // Cleanup listeners
          worker.events.removeListener('request:start', onStart);
          worker.events.removeListener('request:end', onEnd);

          // Put snapshot next to the story
          const snapshotPath = path.join(
            storyDir,
            options.snapshotsDirName,
            `${componentName}.${name}${options.snapshotExtension}`
          );

          // Get rid of random id's in the ouput
          replaceUseId(document);

          document.body.removeAttribute('style');

          expect(document.body).toMatchFileSnapshot(snapshotPath);
        });
      });
    });
  });
});
