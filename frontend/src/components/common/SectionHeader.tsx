import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyles = makeStyles(theme => ({
  sectionHeader: {
    padding: '1em',
  },
}));

export interface SectionHeaderProps {
  title: string;
  actions?: React.ReactNode[] | null;
}

export default function SectionHeader(props: SectionHeaderProps) {
  const classes = useStyles();
  const actions = props.actions || [];

  return (
    <Grid
      container
      alignItems="center"
      justify="space-between"
      wrap="nowrap"
      className={classes.sectionHeader}
    >
      {props.title &&
        <Grid item md={6}>
          <Typography variant="h5">{props.title}</Typography>
        </Grid>
      }
      {actions.length > 0 &&
        <Grid
          item
          md={6}
          container
          alignItems="center"
          justify="flex-end"
        >
          {actions.map((action, i) =>
            <Grid item key={i}>
              {action}
            </Grid>
          )}
        </Grid>
      }
    </Grid>
  );
}
