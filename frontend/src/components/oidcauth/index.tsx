import { Typography } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { useLocation } from 'react-router-dom';
import { setToken } from '../../lib/auth';

const OIDCAuth: FunctionComponent<{}> = () => {
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const token = urlSearchParams.get('token');
  const cluster = urlSearchParams.get('cluster');

  localStorage.setItem('auth_status', 'success');
  setToken(cluster as string, token);

  return (
    <Typography color="textPrimary">Redirecting to main page.....</Typography>
  );
};

export default OIDCAuth;
