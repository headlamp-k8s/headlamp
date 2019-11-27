import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyles = makeStyles(theme => ({
  nameLabel: {
    color: theme.palette.text.secondary,
    fontSize: '1.1em',
    textAlign: 'right'
  },
  nameLabelItem: {
    textAlign: 'right',
    flex: '0 0 200px'
  },
  valueLabel: {
    color: theme.palette.text.primary,
    fontSize: '1.1em',
    wordBreak: 'break-word'
  },
  statusLabel: {
    color: theme.palette.primary.contrastText,
    fontSize: '1.1em',
    wordBreak: 'break-word',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(.5),
    paddingBottom: theme.spacing(.5),
    borderRadius: '5%',
  },
}));

export function InfoLabel(props) {
  const classes = useStyles();
  const {name, value=null} = props;

  return (
    <Grid
      container
      item
      spacing={2}
      justify="flex-start"
      alignItems="flex-start"
    >
      <Grid item xs className={classes.nameLabelItem}>
        <NameLabel>{name}</NameLabel>{' '}
      </Grid>
      <Grid item xs>
        {value !== null ?
          <ValueLabel>{value}</ValueLabel>
          :
          props.children
        }
      </Grid>
    </Grid>
  );
}

export function NameLabel(props) {
  const classes = useStyles();
  return (
    <Typography className={classes.nameLabel} component="span">{props.children}</Typography>
  );
}

export function ValueLabel(props) {
  const classes = useStyles();
  return (
    <Typography className={classes.valueLabel} component="span">{props.children}</Typography>
  );
}

export function StatusLabel(props) {
  const { status, ...other } = props;
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Typography
      className={classes.statusLabel}
      style={{
        backgroundColor: theme.palette[status].main,
      }}
      component="span"
      {...other}
    />
  );
}
