import windowSize from './windowSize';

describe('windowSize', () => {
  const withMargin = true;
  const noMargin = false;
  const table = [
    [{ width: 1366, height: 768 }, withMargin, { width: 1286, height: 608 }], // "Popular"
    [{ width: 1920, height: 1080 }, withMargin, { width: 1840, height: 920 }], // "HD"
    [{ width: 2880, height: 1800 }, withMargin, { width: 1840, height: 920 }], // "Mac retina"
    [{ width: 3240, height: 2160 }, withMargin, { width: 1840, height: 920 }], // "SB3"
    [{ width: 3840, height: 2160 }, withMargin, { width: 1840, height: 920 }], // "4K"
    [{ width: 1366, height: 768 }, noMargin, { width: 1366, height: 768 }], // "Popular"
    [{ width: 1920, height: 1080 }, noMargin, { width: 1920, height: 1080 }], // "HD"
    [{ width: 2880, height: 1800 }, noMargin, { width: 1920, height: 1080 }], // "Mac retina"
    [{ width: 3240, height: 2160 }, noMargin, { width: 1920, height: 1080 }], // "SB3"
    [{ width: 3840, height: 2160 }, noMargin, { width: 1920, height: 1080 }], // "4K"
  ];

  it.each(table)('windowSize(%p, %p) == %p', (workArea, useMargin, expected) => {
    expect(windowSize(workArea, useMargin)).toEqual(expected);
  });
});
