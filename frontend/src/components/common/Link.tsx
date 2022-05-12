import MuiLink from '@material-ui/core/Link';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeKubeObject } from '../../lib/k8s/cluster';
import { createRouteURL, RouteURLProps } from '../../lib/router';

export interface LinkProps {
  /** A key in the default routes object (given by router.tsx's getDefaultRoutes). */
  routeName: string;
  /** An object with corresponding params for the pattern to use. */
  params?: RouteURLProps;
  /** A string representation of query parameters. */
  search?: string;
  /** State to persist to the location. */
  state?: {
    [prop: string]: any;
  };
}

export interface LinkObjectProps {
  kubeObject: InstanceType<ReturnType<typeof makeKubeObject>>;
  [prop: string]: any;
}

export default function Link(props: React.PropsWithChildren<LinkProps | LinkObjectProps>) {
  if ((props as LinkObjectProps).kubeObject) {
    const { kubeObject, ...otherProps } = props as LinkObjectProps;
    return (
      <MuiLink component={RouterLink} to={kubeObject.getDetailsLink()} {...otherProps}>
        {props.children || kubeObject.getName()}
      </MuiLink>
    );
  }

  const { routeName, params = {}, search, state, ...otherProps } = props as LinkProps;
  return (
    <MuiLink
      component={RouterLink}
      to={{
        pathname: createRouteURL(routeName, params),
        search,
        state,
      }}
      {...otherProps}
    >
      {props.children}
    </MuiLink>
  );
}
