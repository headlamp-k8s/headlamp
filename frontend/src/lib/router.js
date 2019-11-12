import React from 'react';
import Overview from '../components/cluster/Overview';
import Auth from '../components/account/Auth';
import NamespacesList from '../components/namespaces/List';

export const ROUTES = [
  {
    path: "/",
    exact: true,
    name: 'Cluster',
    component: () => <Overview />
  },
  {
    path: "/namespaces",
    name: 'Namespaces',
    component: () => <NamespacesList />
  },
  {
    path: "/login",
    exact: true,
    name: 'Login',
    component: () => <Auth />
  },
];
