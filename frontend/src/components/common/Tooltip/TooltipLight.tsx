import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';
const PREFIX = 'TooltipLight';

const classes = {
  tooltip: `${PREFIX}-tooltip`,
};

const StyledTooltip = styled(Tooltip)(({ theme }) => ({
  [`& .${classes.tooltip}`]: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.resourceToolTip.color,
    boxShadow: theme.shadows[1],
    fontSize: '1rem',
    whiteSpace: 'pre-line',
  },
}));

export interface TooltipLightProps extends TooltipProps {
  /**
   * If true, the tooltip will be interactive. Defaults to true.
   *
   * If a tooltip is interactive, it will close when the user hovers over the tooltip before the leaveDelay is expired.
   */
  interactive?: boolean;
}

export default function TooltipLight(props: TooltipLightProps) {
  const { children, interactive = true, ...rest } = props;
  const disableInteractive = !interactive;

  if (typeof children === 'string') {
    return (
      <StyledTooltip disableInteractive={disableInteractive} {...rest}>
        <span>{children}</span>
      </StyledTooltip>
    );
  }

  return (
    <StyledTooltip
      {...props}
      classes={{
        tooltip: classes.tooltip,
      }}
    />
  );
}
