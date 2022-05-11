import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import headlampBrokenImage from '../../assets/headlamp-404.svg';

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

export default function NotFoundComponent() {
  const { t } = useTranslation('frequent');
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
        <img src={headlampBrokenImage} alt="" className={classes.img} />
        <Typography variant="h1" className={classes.h1}>
          {t(`Whoops! This page doesn't exist`)}
        </Typography>
        <Typography variant="h2" className={classes.h2}>
          <Trans t={t}>
            Head back <Link to="/">home</Link>.
          </Trans>
        </Typography>
      </Grid>
    </Grid>
  );
}
