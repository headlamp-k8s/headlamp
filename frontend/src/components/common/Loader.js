import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles({
  loaderContainer: {
    margin: '30px auto',
    textAlign: 'center',
  }
});

export default function Loader(props) {
  const classes = useStyles();
  const {noContainer = false, ...other} = props;
  const progress = <CircularProgress {...other} />;

  if (noContainer)
    return progress;

  return (
    <Box className={classes.loaderContainer}>
      {progress}
    </Box>
  );
}
