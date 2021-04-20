import informationOutline from '@iconify/icons-mdi/information-outline';
import { Icon, IconifyIcon } from '@iconify/react';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';
import TooltipLight from './TooltipLight';

export interface TooltipIconProps {
  children: string;
  /** A materialui/core icon. */
  icon?: object;
}

const useContainerStyles = makeStyles({
  container: {
    display: 'inline',
    padding: '0 .3rem',
  },
});

const IconReffed = React.forwardRef((props: IconifyIcon, ref: any) => {
  const classes = useContainerStyles({});
  return (
    <Container ref={ref} className={classes.container}>
      <Icon {...props} />
    </Container>
  );
});

export default function TooltipIcon(props: TooltipIconProps) {
  const { children, icon = informationOutline } = props;

  return (
    <TooltipLight title={children} interactive>
      <IconReffed icon={icon} />
    </TooltipLight>
  );
}
