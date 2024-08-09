import { configureStore } from '@reduxjs/toolkit';
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import Event from '../lib/k8s/event';
import defaultStore from '../redux/stores/store';

export type TestContextProps = PropsWithChildren<{
  store?: ReturnType<typeof configureStore>;
  routerMap?: Record<string, string>;
  urlPrefix?: string;
  withObjectEvents?: boolean;
  urlSearchParams?: {
    [key: string]: string;
  };
}>;

export function TestContext(props: TestContextProps) {
  const {
    store,
    routerMap,
    urlPrefix = '',
    urlSearchParams,
    withObjectEvents = true,
    children,
  } = props;
  let url = '';
  let routePath = '';

  for (const [key, value] of Object.entries(routerMap || {})) {
    // Add the prefix : to the key to make it a param if needed.
    routePath += '/' + (key.startsWith(':') ? key : ':' + key);
    url += '/' + value;
  }

  if (!!urlPrefix) {
    const prefix = urlPrefix.endsWith('/') ? urlPrefix.slice(0, -1) : urlPrefix;
    url = prefix + url;
    routePath = prefix + routePath;
  }

  if (!!urlSearchParams) {
    url += '?' + new URLSearchParams(urlSearchParams).toString();
  }

  if (withObjectEvents) {
    // override Event.objectEvents to return phony events array
    Event.objectEvents = () =>
      Promise.resolve([
        {
          type: 'Normal',
          reason: 'Created',
          message: 'Created',
          source: {
            component: 'kubelet',
          },
          firstTimestamp: '2021-03-01T00:00:00Z',
          lastTimestamp: '2021-03-01T00:00:00Z',
          count: 1,
        },
      ]);
  }

  return (
    <Provider store={store || defaultStore}>
      <MemoryRouter initialEntries={url ? [url] : undefined}>
        {routePath ? <Route path={routePath}>{children}</Route> : children}
      </MemoryRouter>
    </Provider>
  );
}

export function overrideKubeObject<U>(kubeObject: U, propsToOverride: Partial<U>) {
  for (const [key, value] of Object.entries(propsToOverride)) {
    if (value !== undefined) {
      // @ts-ignore
      kubeObject[key] = value;
    }
  }
}
