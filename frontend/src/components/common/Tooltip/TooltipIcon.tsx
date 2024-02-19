import { Icon, IconProps } from '@iconify/react';
import Container from '@mui/material/Container';
import React from 'react';
import TooltipLight from './TooltipLight';

export interface TooltipIconProps {
  children: string;
  /** A materialui/core icon. */
  icon?: IconProps['icon'];
}

const IconReffed = React.forwardRef((props: IconProps, ref: any) => {
  return (
    <Container ref={ref} sx={{ display: 'inline', padding: '0 .3rem' }}>
      <Icon {...props} />
    </Container>
  );
});

export default function TooltipIcon(props: TooltipIconProps) {
  const { children, icon = 'mdi:information-outline' } = props;

  return (
    <TooltipLight title={children} interactive>
      <IconReffed icon={icon} />
    </TooltipLight>
  );
}
