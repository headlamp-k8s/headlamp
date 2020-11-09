import informationOutline from '@iconify/icons-mdi/information-outline';
import { Icon, IconifyIcon } from '@iconify/react';
import Container from '@material-ui/core/Container';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';

const LightTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.resourceToolTip.color,
    boxShadow: theme.shadows[1],
    fontSize: '1rem',
    whiteSpace: 'pre-line',
  },
}))(Tooltip);

export { LightTooltip };

interface TooltipIconProps {
  children: string;
  icon?: object;
}

const useContainerStyles = makeStyles({
  container: {
    display: 'inline',
    padding: '0 .3rem',
  },
});

export function TooltipIcon(props: TooltipIconProps) {
  const classes = useContainerStyles();
  const { children, icon = informationOutline } = props;

  const IconReffed = React.forwardRef((props: IconifyIcon, ref) => {
    return (
      <Container
        ref={ref}
        className={classes.container}
      >
        <Icon {...props} />
      </Container>
    );
  });

  return (
    <LightTooltip title={children} interactive>
      <IconReffed icon={icon} />
    </LightTooltip>
  );
}
