import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyle = makeStyles(() => ({
  pods: {
    fontStyle: 'italic',
  },
}));

export interface MessageProps {
  /** String to display. */
  msg: string;
  /** True if there's an error. */
  error: boolean;
}

/**
 * For showing our action item message.
 *
 * This is a pure presentational component to make it
 * easier to use in storybook.
 *
 * See https://storybook.js.org/docs/web-components/writing-stories/build-pages-with-storybook
 *
 */
export default function Message({ msg, error }: MessageProps) {
  const classes = useStyle();
  return (
    <Typography color="textPrimary" className={classes.pods}>
      {!error ? `# Pods: ${msg}` : 'Uh, pods!?'}
    </Typography>
  );
}
