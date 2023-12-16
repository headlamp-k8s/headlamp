import { Theme } from '@mui/material';
import Box, { BoxProps } from '@mui/material/Box';
import makeStyles from '@mui/styles/makeStyles';
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

const useStyles = makeStyles((theme: Theme) => ({
  box: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
}));

export function SectionBox(props: SectionBoxProps) {
  const {
    title,
    children,
    headerProps = { noPadding: false, headerStyle: 'subsection' },
    outterBoxProps = {},
    backLink,
    ...otherProps
  } = props;

  const classes = useStyles();

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
        <Box className={classes.box} {...otherProps}>
          {React.Children.toArray(children)}
        </Box>
      </Box>
    </>
  );
}

export default SectionBox;
