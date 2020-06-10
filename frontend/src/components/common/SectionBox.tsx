import Box, { BoxProps } from '@material-ui/core/Box';
import React from 'react';
import SectionHeader, { SectionHeaderProps } from './SectionHeader';

interface SectionBoxProps extends Omit<BoxProps, 'title'> {
  title?: React.ReactNode;
  headerProps?: Omit<SectionHeaderProps, 'title'>;
}

export function SectionBox(props: SectionBoxProps) {
  const {
    title,
    children,
    headerProps = {noPadding: false, headerStyle: 'subsection'},
    ...otherProps
  } = props;

  let titleElem: React.ReactNode;

  if (typeof title === 'string') {
    titleElem =
      <SectionHeader
        title={title as string}
        {...headerProps}
      />;
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
