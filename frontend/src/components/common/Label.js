import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import React from 'react';

const useStyles = makeStyles(theme => ({
  nameLabel: {
    color: theme.palette.text.secondary,
    fontSize: '1.1em',
    textAlign: "right"
  },
  nameLabelItem: {
    textAlign: "right",
    flex: "0 0 200px"
  },
  valueLabel: {
    color: theme.palette.text.primary,
    fontSize: '1.1em',
    wordBreak: "break-word"
  },
}));

export function InfoLabel(props) {
  const classes = useStyles();
  let {name, value=null} = props;

  return (
    <Grid
      container
      item
      spacing={2}
      justify="flex-start"
      alignItems="flex-start"
    >
      <Grid item xs className={classes.nameLabelItem}>
        <NameLabel>{name}</NameLabel>{" "}
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
