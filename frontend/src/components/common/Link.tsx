import MuiLink from '@material-ui/core/Link';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeKubeObject } from '../../lib/k8s/cluster';
import { createRouteURL, RouteURLProps } from '../../lib/router';

interface LinkProps {
  routeName: string;
  params?: RouteURLProps;
}

interface LinkObjectProps {
  kubeObject: InstanceType<ReturnType<typeof makeKubeObject>>;
}

export default function Link(props: React.PropsWithChildren<LinkProps | LinkObjectProps>) {
  if ((props as LinkObjectProps).kubeObject) {
    const { kubeObject } = props as LinkObjectProps;
    return (
      <MuiLink component={RouterLink} to={kubeObject.getDetailsLink()}>
        {props.children || kubeObject.getName()}
      </MuiLink>
    );
  }

  const { routeName, params = {} } = props as LinkProps;
  return (
    <MuiLink component={RouterLink} to={createRouteURL(routeName, params)}>
      {props.children}
    </MuiLink>
  );
}
