import { Box, styled } from '@mui/material';

/**
 * Displays children after a delay
 *
 * @param props.delayMs - Delay in milliseconds. Default 500ms
 */
export const Delayed = styled(Box)<{ delayMs?: number }>`
  animation: delayed-reveal 0.3s;
  animation-delay: ${p => p.delayMs ?? 500}ms;
  animation-fill-mode: both;

  @keyframes delayed-reveal {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
