import Box, { BoxProps } from '@material-ui/core/Box';
import React from 'react';
import SectionHeader from './SectionHeader';

interface SectionBoxProps extends Omit<BoxProps, 'title'> {
  title?: React.ReactNode;
}

export function SectionBox(props: SectionBoxProps) {
  const {title, children, ...otherProps} = props;

  let titleElem: React.ReactNode;

  if (typeof title === 'string') {
    titleElem = <SectionHeader noPadding title={title as string} />;
  } else {
    titleElem = title as JSX.Element;
  }

  return (
    <Box
      px={2}
      paddingBottom={1}
      {...otherProps}
    >
      { title && titleElem }
      {React.Children.toArray(children)}
    </Box>
  );
}
