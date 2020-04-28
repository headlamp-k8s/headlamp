import MuiLink from '@material-ui/core/Link';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { createRouteURL, RouteURLProps } from '../../lib/router';

interface LinkProps {
  routeName: string;
  params?: RouteURLProps;
}

export default function Link(props: React.PropsWithChildren<LinkProps>) {
  const { routeName, params = {} } = props;
  return (
    <MuiLink component={RouterLink} to={createRouteURL(routeName, params)}>
      {props.children}
    </MuiLink>
  );
}
