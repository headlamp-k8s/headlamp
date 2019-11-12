import React from 'react';
import Auth from '../components/account/Auth';
import Overview from '../components/cluster/Overview';

export const ROUTES = [
  {
    path: '/',
    exact: true,
    name: 'Cluster',
    component: () => <Overview />
  },
  {
    path: '/login',
    exact: true,
    name: 'Login',
    component: () => <Auth />
  },
];
