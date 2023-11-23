import Tooltip, { TooltipProps } from '@mui/material/Tooltip';
import withStyles from '@mui/styles/withStyles';

export interface TooltipLightProps extends TooltipProps {
  /**
   * If true, the tooltip will be interactive. Defaults to true.
   *
   * If a tooltip is interactive, it will close when the user hovers over the tooltip before the leaveDelay is expired.
   */
  interactive?: boolean;
}

const StyledTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.resourceToolTip.color,
    boxShadow: theme.shadows[1],
    fontSize: '1rem',
    whiteSpace: 'pre-line',
  },
}))(Tooltip);

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

  return <StyledTooltip {...props} />;
}
