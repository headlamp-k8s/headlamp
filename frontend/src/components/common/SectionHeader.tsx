import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyles = makeStyles(theme => ({
  sectionHeader: {
    padding: ({noPadding}: {noPadding: boolean}) => noPadding ? '0' : '1rem',
  },
  title: {
    fontWeight: 'bold',
  }
}));

export interface SectionHeaderProps {
  title: string;
  actions?: React.ReactNode[] | null;
  noPadding?: boolean;
}

export default function SectionHeader(props: SectionHeaderProps) {
  const {noPadding = false} = props;
  const classes = useStyles({noPadding});
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
          <Typography
            variant="h6"
            className={classes.title}
          >
            {props.title}
          </Typography>
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
