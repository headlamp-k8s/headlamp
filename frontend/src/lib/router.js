import React from 'react';
import Auth from '../components/account/Auth';
import Overview from '../components/cluster/Overview';
import NamespacesList from '../components/namespace/List';
import NodeList from '../components/node/List';

export const ROUTES = [
  {
    path: '/',
    exact: true,
    name: 'Cluster',
    component: () => <Overview />
  },
  {
    path: '/namespaces',
    name: 'Namespaces',
    component: () => <NamespacesList />
  },
  {
    path: '/nodes',
    name: 'Nodes',
    component: () => <NodeList />
  },
  {
    path: '/login',
    exact: true,
    name: 'Login',
    component: () => <Auth />
  },
];
