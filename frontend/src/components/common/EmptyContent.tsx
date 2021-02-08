import Box from '@material-ui/core/Box';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import React from 'react';

export default function Empty(props: React.PropsWithChildren<{ color: TypographyProps['color'] }>) {
  return (
    <Box padding={2}>
      {React.Children.map(props.children, child => {
        if (typeof child === 'string') {
          return (
            <Typography color={props.color} align="center">
              {child}
            </Typography>
          );
        }
        return child;
      })}
    </Box>
  );
}

Empty.defaultProps = { color: 'textSecondary' };
