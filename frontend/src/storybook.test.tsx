import initStoryshots, { Stories2SnapsConverter } from '@storybook/addon-storyshots';
import * as rtl from '@testing-library/react';
import path from 'path';
import React from 'react';

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

  test: ({ story: { storyFn: Story }, context }) => {
    // We use React Testing library here, and our custom converter.
    const converter = new OurConverter();
    const snapshotFilename = converter.getSnapshotFileName(context);
    const rendered = rtl.render(
      <div id="root">
        <Story {...context} />
      </div>
    );
    expect(rendered).toMatchSpecificSnapshot(snapshotFilename);
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
