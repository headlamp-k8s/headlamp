import MuiLink from '@mui/material/Link';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { makeKubeObject } from '../../lib/k8s/cluster';
import { createRouteURL, RouteURLProps } from '../../lib/router';
import {
  setDetailDrawerOpen,
  updateDrawerCluster,
  updateDrawerName,
  updateDrawerNamespace,
  updateDrawerResource,
} from '../../redux/drawerModeSlice';
import { LightTooltip } from './Tooltip';

export interface LinkBaseProps {
  /** The tooltip to display on hover. If true, the tooltip will be the link's text. */
  tooltip?: string | boolean;
}

export interface LinkProps extends LinkBaseProps {
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
  drawerEnabled?: boolean;
}

export interface LinkObjectProps extends LinkBaseProps {
  kubeObject: InstanceType<ReturnType<typeof makeKubeObject>>;
  [prop: string]: any;
}

function PureLink(props: React.PropsWithChildren<LinkProps | LinkObjectProps>) {
  if ((props as LinkObjectProps).kubeObject) {
    const { kubeObject, drawerEnabled, ...otherProps } = props as LinkObjectProps;
    const dispatch = useDispatch();

    function drawerLinkHandler(event: any) {
      // this will be use to determine if the drawer needs to open when the link is clicked or change pages
      const drawerResourcesAllowed = [
        'pods',
        'deployments',
        'replicasets',
        'jobs',
        'cronjobs',
        'daemonsets',
        'statefulsets',
      ];

      console.log('LINK STRING: ', kubeObject.getDetailsLink());
      const url = kubeObject.getDetailsLink();
      const urlPieces = url.split('/');
      console.log('URL PIECES: ', urlPieces);
      const linkCluster = urlPieces[2];
      const linkResource = urlPieces[3];
      const linkNamespace = urlPieces[4];
      const linkName = urlPieces[5];

      // if the resource bit from the url matches the resources allowed, then open the drawer
      if (drawerResourcesAllowed.includes(linkResource)) {
        event.preventDefault();
        // window.history.pushState({}, '', url);

        dispatch(updateDrawerCluster(linkCluster));
        dispatch(updateDrawerResource(linkResource));
        dispatch(updateDrawerNamespace(linkNamespace));
        dispatch(updateDrawerName(linkName));
        dispatch(setDetailDrawerOpen(true));
      }
    }

    return (
      <>
        {drawerEnabled === true ? (
          <MuiLink
            component={RouterLink}
            to={kubeObject.getDetailsLink()}
            {...otherProps}
            onClick={drawerLinkHandler}
          >
            {props.children || kubeObject.getName()}
          </MuiLink>
        ) : (
          <MuiLink component={RouterLink} to={kubeObject.getDetailsLink()} {...otherProps}>
            {props.children || kubeObject.getName()}
          </MuiLink>
        )}
      </>
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

export default function Link(props: React.PropsWithChildren<LinkProps | LinkObjectProps>) {
  const { tooltip, ...otherProps } = props;
  if (tooltip) {
    let tooltipText = '';
    if (typeof tooltip === 'string') {
      tooltipText = tooltip;
    } else if ((props as LinkObjectProps).kubeObject) {
      tooltipText = (props as LinkObjectProps).getName();
    } else if (typeof props.children === 'string') {
      tooltipText = props.children;
    }

    if (!!tooltipText) {
      return (
        <LightTooltip title={tooltipText} interactive>
          <span>
            <PureLink {...otherProps} />
          </span>
        </LightTooltip>
      );
    }
  }

  return <PureLink {...otherProps} />;
}
