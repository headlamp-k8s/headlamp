import MuiLink from '@material-ui/core/Link';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { createRouteURL } from '../../lib/router';

export default function Link(props) {
  const { routeName, params = {} } = props;
  return (
    <MuiLink component={RouterLink} to={createRouteURL(routeName, params)}>
      {props.children}
    </MuiLink>
  );
}
