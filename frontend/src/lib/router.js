import React from 'react';
import ClusterOverview from '../components/ClusterOverview';
import Auth from '../components/account/Auth';

export const ROUTES = [
  {
    path: "/",
    exact: true,
    name: 'Cluster',
    component: () => <ClusterOverview />
  },
  {
    path: "/login",
    exact: true,
    name: 'Login',
    component: () => <Auth />
  },
];
