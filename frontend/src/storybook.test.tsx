import initStoryshots, { Stories2SnapsConverter } from '@storybook/addon-storyshots';
import * as rtl from '@testing-library/react';
import path from 'path';

/**
 * The storyshot addon has some bug where the path is src/
 *  and the cwd is src, so it makes src/src folders.
 */
class OurConverter extends Stories2SnapsConverter {
  getStoryshotFile(fileName: string) {
    const name = super.getStoryshotFile(fileName);
    if (name.startsWith('src')) {
      return path.join('..', name);
    }
    return name;
  }
}

initStoryshots({
  stories2snapsConverter: new OurConverter(),
  asyncJest: true,
  test: async ({ story, context, done }) => {
    // We use React Testing library here, and our custom converter.
    const converter = new OurConverter();
    const snapshotFilename = converter.getSnapshotFileName(context);

    // Re-render for state changes:
    // https://github.com/storybookjs/storybook/issues/7745#issuecomment-801940326
    // Difference to above is we do everything within an act(),
    //   so that the initial render is also within an act.
    const jsx = story.render();
    await rtl.act(async () => {
      const { unmount, rerender, container } = await rtl.render(jsx);
      // wait for state changes
      await rtl.act(() => new Promise(resolve => setTimeout(resolve)));

      await rtl.act(async () => {
        await rerender(jsx);
      });
      expect(container).toMatchSpecificSnapshot(snapshotFilename);

      unmount();
    });

    done!();
  },
  snapshotSerializers: [
    {
      print: (val: any, serialize) => {
        const root = val.container.firstChild;
        return serialize(root);
      },
      test: val => val.hasOwnProperty('container'),
    },
  ],
});
