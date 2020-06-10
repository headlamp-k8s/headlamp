import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

type HeaderStyle = 'main' | 'subsection' | 'normal';

export interface HeaderStyleProps {
  noPadding?: boolean;
  headerStyle?: HeaderStyle;
}

const useStyles = makeStyles(theme => ({
  sectionHeader: ({noPadding, headerStyle}: HeaderStyleProps) => ({
    padding: theme.spacing(noPadding ? 0 : 2),
    paddingTop: theme.spacing(noPadding ? 0 : 3),
    paddingRight: '0',
    ...theme.palette.headerStyle[headerStyle || 'normal']
  }),
  title: {
    fontWeight: 'bold',
  },
}));

export interface SectionHeaderProps {
  title: string;
  actions?: React.ReactNode[] | null;
  noPadding?: boolean;
  headerStyle?: HeaderStyle;
}

export default function SectionHeader(props: SectionHeaderProps) {
  const {noPadding = false, headerStyle = 'main'} = props;
  const classes = useStyles({noPadding, headerStyle});
  const actions = props.actions || [];

  return (
    <Grid
      container
      alignItems="center"
      justify="space-between"
      className={classes.sectionHeader}
      spacing={2}
    >
      {props.title &&
        <Grid
          item
        >
          <Typography
            variant="h6"
            className={classes.title}
            noWrap
          >
            {props.title}
          </Typography>
        </Grid>
      }
      {actions.length > 0 &&
        <Grid item>
          <Grid
            item
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
        </Grid>
      }
    </Grid>
  );
}
