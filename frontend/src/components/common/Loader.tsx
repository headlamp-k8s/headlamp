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
  title: string;
}

export default function Loader(props: LoaderProps & CircularProgressProps) {
  const classes = useStyles();
  const { noContainer = false, title, ...other } = props;
  const progress = <CircularProgress title={title} {...other} />;

  if (noContainer) return progress;

  return (
    <Box className={classes.loaderContainer} py={3} px="auto">
      {progress}
    </Box>
  );
}
