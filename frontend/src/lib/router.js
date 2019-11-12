import React from 'react';
import Overview from '../components/cluster/Overview';
import Auth from '../components/account/Auth';

export const ROUTES = [
  {
    path: "/",
    exact: true,
    name: 'Cluster',
    component: () => <Overview />
  },
  {
    path: "/login",
    exact: true,
    name: 'Login',
    component: () => <Auth />
  },
];
