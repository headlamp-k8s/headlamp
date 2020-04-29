import Box, { BoxProps } from '@material-ui/core/Box';
import React from 'react';

export function SectionBox(props: BoxProps) {
  return (
    <Box px={2} paddingBottom={1} {...props} />
  );
}
