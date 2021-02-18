import initStoryshots, { Stories2SnapsConverter } from '@storybook/addon-storyshots';
import * as rtl from '@testing-library/react';
import React from 'react';

initStoryshots({
  test: ({ story: { storyFn: Story }, context }) => {
    const converter = new Stories2SnapsConverter();
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
      print: (val, serialize) => {
        const root = val.container.firstChild;
        return serialize(root);
      },
      test: val => val.hasOwnProperty('container'),
    },
  ],
});
