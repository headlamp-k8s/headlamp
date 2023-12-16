import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Variant } from '@mui/material/styles/createTypography';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
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
  titleSideActions?: React.ReactNode[];
}

export default function SectionHeader(props: SectionHeaderProps) {
  const { noPadding = false, headerStyle = 'main', titleSideActions = [] } = props;
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
      <Grid item>
        {(!!props.title || titleSideActions.length > 0) && (
          <Box display="flex" alignItems="center">
            {!!props.title && (
              <Typography
                variant={titleVariants[headerStyle]}
                noWrap
                className={classes.sectionTitle}
              >
                {props.title}
              </Typography>
            )}
            {!!titleSideActions && (
              <Box ml={1} justifyContent="center">
                {titleSideActions}
              </Box>
            )}
          </Box>
        )}
      </Grid>
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
