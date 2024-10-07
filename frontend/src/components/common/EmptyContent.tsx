import Box from '@mui/material/Box';
import Typography, { TypographyProps } from '@mui/material/Typography';
import React from 'react';

type EmptyProps = React.PropsWithChildren<{
  color?: TypographyProps['color'];
}>;

export default function Empty({ color = 'textSecondary', children }: EmptyProps) {
  return (
    <Box padding={2}>
      {React.Children.map(children, child => {
        if (typeof child === 'string') {
          return (
            <Typography color={color} align="center">
              {child}
            </Typography>
          );
        }
        return child;
      })}
    </Box>
  );
}
