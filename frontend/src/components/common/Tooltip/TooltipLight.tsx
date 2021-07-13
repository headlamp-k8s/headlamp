import { withStyles } from '@material-ui/core/styles';
import Tooltip, { TooltipProps as TooltipLightProps } from '@material-ui/core/Tooltip';

const TooltipLight = withStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.resourceToolTip.color,
    boxShadow: theme.shadows[1],
    fontSize: '1rem',
    whiteSpace: 'pre-line',
  },
}))(Tooltip);

export default TooltipLight;

export type { TooltipLightProps };
