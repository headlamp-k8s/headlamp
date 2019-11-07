import React from 'react';
import Auth from '../components/account/Auth';
import ClusterOverview from '../components/ClusterOverview';

export const ROUTES = [
  {
    path: '/',
    exact: true,
    name: 'Cluster',
    component: () => <ClusterOverview />
  },
  {
    path: '/login',
    exact: true,
    name: 'Login',
    component: () => <Auth />
  },
];
