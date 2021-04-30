import Box from '@material-ui/core/Box';
import CircularProgress, { CircularProgressProps } from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles({
  loaderContainer: {
    textAlign: 'center',
  },
});

export interface LoaderProps {
  noContainer?: boolean;
}

export default function Loader(props: LoaderProps & CircularProgressProps) {
  const classes = useStyles();
  const { noContainer = false, ...other } = props;
  const progress = <CircularProgress {...other} />;

  if (noContainer) return progress;

  return (
    <Box className={classes.loaderContainer} py={3} px="auto" aria-label="Loading" role="status">
      {progress}
    </Box>
  );
}
