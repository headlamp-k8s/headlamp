import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Variant } from '@material-ui/core/styles/createTypography';
import Typography from '@material-ui/core/Typography';
import React from 'react';

type HeaderStyle = 'main' | 'subsection' | 'normal' | 'label';

export interface HeaderStyleProps {
  noPadding?: boolean;
  headerStyle?: HeaderStyle;
}

const useStyles = makeStyles(theme => ({
  sectionHeader: ({ noPadding }: HeaderStyleProps) => ({
    padding: theme.spacing(noPadding ? 0 : 2),
    paddingTop: theme.spacing(noPadding ? 0 : 3),
    paddingRight: '0',
  }),
  sectionTitle: ({ headerStyle }: HeaderStyleProps) => ({
    ...theme.palette.headerStyle[headerStyle || 'normal'],
    whiteSpace: 'pre-wrap',
  }),
}));

export interface SectionHeaderProps {
  title: string;
  actions?: React.ReactNode[] | null;
  noPadding?: boolean;
  headerStyle?: HeaderStyle;
}

export default function SectionHeader(props: SectionHeaderProps) {
  const { noPadding = false, headerStyle = 'main' } = props;
  const classes = useStyles({ noPadding, headerStyle });
  const actions = props.actions || [];
  const titleVariants: { [key: string]: Variant } = {
    main: 'h1',
    subsection: 'h2',
    normal: 'h3',
    label: 'h4',
  };

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      className={classes.sectionHeader}
      spacing={2}
    >
      {props.title && (
        <Grid item>
          <Typography variant={titleVariants[headerStyle]} noWrap className={classes.sectionTitle}>
            {props.title}
          </Typography>
        </Grid>
      )}
      {actions.length > 0 && (
        <Grid item>
          <Grid item container alignItems="center" justifyContent="flex-end">
            {actions.map((action, i) => (
              <Grid item key={i}>
                {action}
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
