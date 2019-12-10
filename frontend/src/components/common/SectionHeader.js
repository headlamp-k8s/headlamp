import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyles = makeStyles(theme => ({
  sectionHeader: {
    padding: '1em',
  },
}));

export default function SectionHeader(props) {
  const classes = useStyles();
  const actions = props.actions || [];

  return (<Grid
    container
    alignItems="center"
    justify="space-between"
    className={classes.sectionHeader}
  >
    {props.title &&
    <Grid item>
      <Typography variant="h5">{props.title}</Typography>
    </Grid>
    }
    {actions &&
              actions.map((action, i) =>
                <Grid item key={i}>
                  {action}
                </Grid>
              )
    }
  </Grid>
  );
}
