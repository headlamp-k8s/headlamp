import { Grid, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import headlampBrokenImage from '../../../assets/headlamp-broken.svg';

const useStyles = makeStyles(() => ({
  root: {
    textAlign: 'center',
  },
  h1: {
    fontSize: '2.125rem',
    lineHeight: 1.2,
    fontWeight: 400,
  },
  h2: {
    fontSize: '1.25rem',
    lineHeight: 3.6,
    fontWeight: 500,
  },
  img: {
    width: '100%',
  },
}));

export interface ErrorComponentProps {
  /** The main title to display. By default it is: "Uh-oh! Something went wrong." */
  title?: React.ReactNode;
  /** The message to display. By default it is: "Head back <a href="..."> home</a>." */
  message?: React.ReactNode;
  /** The graphic or element to display as a main graphic. If used as a string, it will be
   * used as the source for displaying an image. By default it is "headlamp-broken.svg". */
  graphic?: React.ReactChild;
  /** Whether to use Typography or not. By default it is true. */
  withTypography?: boolean;
}

export default function ErrorComponent(props: ErrorComponentProps) {
  const { t } = useTranslation();
  const {
    title = t('Uh-oh! Something went wrong.'),
    message = '',
    withTypography = true,
    graphic = headlampBrokenImage,
  } = props;
  const classes = useStyles();
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      className={classes.root}
    >
      <Grid item xs={12}>
        {typeof graphic === 'string' ? (
          <img src={graphic} alt="" className={classes.img} />
        ) : (
          graphic
        )}
        {withTypography ? (
          <Typography variant="h1" className={classes.h1}>
            {title}
          </Typography>
        ) : (
          title
        )}
        {withTypography ? (
          <Typography variant="h2" className={classes.h2}>
            {!!message ? (
              message
            ) : (
              <Trans t={t}>
                Head back <Link href="/">home</Link>.
              </Trans>
            )}
          </Typography>
        ) : (
          message
        )}
      </Grid>
    </Grid>
  );
}
