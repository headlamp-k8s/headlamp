import React from 'react';
import Overview from '../components/cluster/Overview';
import WorkloadOverview from '../components/workload/Overview';
import Auth from '../components/account/Auth';
import NamespacesList from '../components/namespace/List';
import NodeList from '../components/node/List';
import StorageClassList from '../components/storage/ClassList';
import PersistentVolumeList from '../components/storage/VolumeList';
import PersistentVolumeClaimList from '../components/storage/ClaimList';

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
    path: "/nodes",
    name: 'Nodes',
    component: () => <NodeList />
  },
  {
    path: "/storage/classes",
    exact: true,
    name: 'Storage Classes',
    component: () => <StorageClassList />
  },
  {
    path: "/storage/persistentvolumes",
    exact: true,
    name: 'Persistent Volumes',
    component: () => <PersistentVolumeList />
  },
  {
    path: "/storage/persistentvolumeclaims",
    exact: true,
    name: 'Persistent Volume Claims',
    component: () => <PersistentVolumeClaimList />
  },
  {
    path: "/workload",
    exact: true,
    name: 'Workloads',
    component: () => <WorkloadOverview />
  },
  {
    path: "/login",
    exact: true,
    name: 'Login',
    component: () => <Auth />
  },
];
