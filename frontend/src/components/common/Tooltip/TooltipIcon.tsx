import { Icon, IconProps } from '@iconify/react';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import React from 'react';
import TooltipLight from './TooltipLight';

const PREFIX = 'TooltipIcon';

const classes = {
  container: `${PREFIX}-container`,
};

const StyledTooltipLight = styled(TooltipLight)({
  [`& .${classes.container}`]: {
    display: 'inline',
    padding: '0 .3rem',
  },
});

export interface TooltipIconProps {
  children: string;
  /** A materialui/core icon. */
  icon?: IconProps['icon'];
}

const IconReffed = React.forwardRef((props: IconProps, ref: any) => {
  return (
    <Container ref={ref} className={classes.container}>
      <Icon {...props} />
    </Container>
  );
});

export default function TooltipIcon(props: TooltipIconProps) {
  const { children, icon = 'mdi:information-outline' } = props;

  return (
    <StyledTooltipLight title={children} interactive>
      <IconReffed icon={icon} />
    </StyledTooltipLight>
  );
}
