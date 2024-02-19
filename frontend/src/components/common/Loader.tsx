import Box from '@mui/material/Box';
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import React from 'react';

export interface LoaderProps {
  noContainer?: boolean;
  title: string;
}

export default function Loader(props: LoaderProps & CircularProgressProps) {
  const { noContainer = false, title, ...other } = props;
  const progress = <CircularProgress title={title} {...other} />;

  if (noContainer) return progress;

  return (
    <Box sx={{ textAlign: 'center' }} py={3} px="auto">
      {progress}
    </Box>
  );
}
