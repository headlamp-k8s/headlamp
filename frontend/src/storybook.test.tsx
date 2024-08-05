import 'vitest-canvas-mock';
import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import type { Meta, StoryFn } from '@storybook/react';
import { composeStories } from '@storybook/react';
import { act, render } from '@testing-library/react';
import path from 'path';
import themesConf from './lib/themes';

type StoryFile = {
  default: Meta;
  [name: string]: StoryFn | Meta;
};

const withThemeProvider = (Story: any) => {
  const lightTheme = themesConf['light'];
  const theme = lightTheme;

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

const compose = (entry: StoryFile) => {
  try {
    return composeStories(entry);
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
  suite: 'Storybook Tests',
  storyKindRegex: /^.*?DontTest$/,
  snapshotsDirName: '__snapshots__',
  snapshotExtension: '.stories.storyshot',
};

vi.mock('@iconify/react', () => ({
  Icon: () => null,
  InlineIcon: () => null,
}));

getAllStoryFiles().forEach(({ storyFile, componentName, storyDir }) => {
  describe(options.suite, () => {
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
          const jsx = withThemeProvider(story);

          await act(async () => {
            const { unmount, asFragment, rerender } = render(jsx);
            rerender(jsx);
            rerender(jsx);
            await act(() => new Promise(resolve => setTimeout(resolve)));

            const snapshotPath = path.join(
              storyDir,
              options.snapshotsDirName,
              `${componentName}.${name}${options.snapshotExtension}`
            );

            expect(asFragment()).toMatchFileSnapshot(snapshotPath);
            unmount();
          });
        });
      });
    });
  });
});
