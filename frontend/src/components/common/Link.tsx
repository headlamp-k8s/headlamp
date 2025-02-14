import MuiLink from '@mui/material/Link';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import helpers from '../../helpers';
import { kubeObjectQueryKey, useEndpoints } from '../../lib/k8s/api/v2/hooks';
import { KubeObject } from '../../lib/k8s/KubeObject';
import { createRouteURL, RouteURLProps } from '../../lib/router';
import { setSelectedResource } from '../../redux/drawerModeSlice';
import { useTypedSelector } from '../../redux/reducers/reducers';
import { canRenderDetails } from '../resourceMap/details/KubeNodeDetails';
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
}

export interface LinkObjectProps extends LinkBaseProps {
  kubeObject?: KubeObject | null;
  [prop: string]: any;
}

function KubeObjectLink(props: { kubeObject: KubeObject; [prop: string]: any }) {
  const { kubeObject, ...otherProps } = props;

  const client = useQueryClient();
  const { namespace, name } = kubeObject.metadata;
  const { endpoint } = useEndpoints(kubeObject._class().apiEndpoint.apiInfo, kubeObject.cluster);

  return (
    <MuiLink
      onClick={() => {
        const key = kubeObjectQueryKey({
          cluster: kubeObject.cluster,
          endpoint,
          namespace,
          name,
        });
        // prepopulate the query cache with existing object
        client.setQueryData(key, kubeObject);
        // and invalidate it (mark as stale)
        // so that the latest version will be downloaded in the background
        client.invalidateQueries({ queryKey: key });
      }}
      component={RouterLink}
      to={kubeObject.getDetailsLink()}
      {...otherProps}
    >
      {props.children || kubeObject!.getName()}
    </MuiLink>
  );
}

function PureLink(props: React.PropsWithChildren<LinkProps | LinkObjectProps>) {
  if ((props as LinkObjectProps).kubeObject) {
    const { kubeObject, ...otherProps } = props as LinkObjectProps;
    return <KubeObjectLink kubeObject={kubeObject!} {...otherProps} />;
  }
  const { routeName, params = {}, search, state, ...otherProps } = props as LinkObjectProps;

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
  const drawerEnabled = useTypedSelector(state => state.drawerMode.isDetailDrawerEnabled);
  const dispatch = useDispatch();

  const { tooltip, kubeObject, ...otherProps } = props as LinkObjectProps;
  const name = 'kubeObject' in props ? props.kubeObject?.getName() : props.params?.name;
  const namespace =
    'kubeObject' in props ? props.kubeObject?.getNamespace() : props.params?.namespace;
  const kind = 'kubeObject' in props ? props.kubeObject?._class().kind : props?.routeName;

  let content: React.ReactNode;

  if (!drawerEnabled || !canRenderDetails(kind)) {
    content = <PureLink {...otherProps} kubeObject={kubeObject} />;
  } else {
    content = (
      <MuiLink
        onClick={() => {
          if (drawerEnabled) {
            dispatch(setSelectedResource({ kind, metadata: { name, namespace } }));
            /**
             * NOTE: we are using window.history.pushState to update the URL without causing a page reload.
             * currently there is no way to update the URL without navigation to the details page which would make the drawer redundant.
             *
             * also note that this currently only works in the browser, not in electron.
             */
            if (!helpers.isElectron()) {
              window.history.pushState(
                { path: createRouteURL(kind, { name, namespace }) },
                '',
                createRouteURL(kind, { name, namespace })
              );
            }
          }
        }}
      >
        {props.children || kubeObject?.getName()}
      </MuiLink>
    );
  }

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
          {content}
        </LightTooltip>
      );
    }
  }

  return content;
}
