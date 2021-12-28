export default function calculateWindowSize(
  workArea: { width: number; height: number },
  withMargin: boolean
) {
  const [maxWidth, maxHeight] = [1920, 1080];
  const { width, height } = workArea;
  const marginHeight = withMargin ? 160 : 0;
  const marginWidth = withMargin ? 80 : 0;

  return {
    width: (width > maxWidth ? maxWidth : width) - marginWidth,
    height: (height > maxHeight ? maxHeight : height) - marginHeight,
  };
}
