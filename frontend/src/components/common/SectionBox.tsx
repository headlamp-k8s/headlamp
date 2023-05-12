import Box, { BoxProps } from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import BackLink, { BackLinkProps } from './BackLink';
import SectionHeader, { SectionHeaderProps } from './SectionHeader';

export interface SectionBoxProps extends Omit<BoxProps, 'title'> {
  title?: React.ReactNode;
  headerProps?: Omit<SectionHeaderProps, 'title'>;
  outterBoxProps?: Omit<BoxProps, 'title'>;
  //** The location to go back to. If provided as an empty string, the browser's history will be used. If not provided (default)), then no back button is used. */
  backLink?: BackLinkProps['to'] | boolean;
}

export function SectionBox(props: SectionBoxProps) {
  const {
    title,
    children,
    headerProps = { noPadding: false, headerStyle: 'subsection' },
    outterBoxProps = {},
    backLink,
    ...otherProps
  } = props;

  let titleElem: React.ReactNode;
  // If backLink is a boolean, then we want to use the browser's history if true.
  const actualBackLink = typeof backLink === 'boolean' ? (!!backLink ? '' : undefined) : backLink;

  if (typeof title === 'string') {
    titleElem = <SectionHeader title={title as string} {...headerProps} />;
  } else {
    titleElem = title as JSX.Element;
  }

  return (
    <>
      {actualBackLink !== undefined && <BackLink to={actualBackLink} />}
      <Box py={0} {...outterBoxProps}>
        {title && titleElem}
        <Paper elevation={0}>
          <Box px={2} {...otherProps}>
            {React.Children.toArray(children)}
          </Box>
        </Paper>
      </Box>
    </>
  );
}

export default SectionBox;
