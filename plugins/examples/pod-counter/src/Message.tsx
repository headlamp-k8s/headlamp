import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTypography = styled(Typography)(() => ({
  fontStyle: 'italic',
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
  return (
    <StyledTypography color="textPrimary">
      {!error ? `# Pods: ${msg}` : 'Uh, pods!?'}
    </StyledTypography>
  );
}
